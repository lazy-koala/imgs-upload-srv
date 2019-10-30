/**
 * @Author: acexy@thankjava.com
 * 2019/4/25
 * @Description: 处理分享
 */
const Router = require('koa-router');
const imagesModel = require('../models/images');
const shareListModel = require('../models/shareList');
const shareImgModel = require('../models/shareImg');
const sortsModel = require('../models/sorts');
const userModel = require('../models/user');

const baseController = require('./baseController');
const util = require('../lib/util');
const baseConfig = require('../config/basic');

const SHARE_PREFIX = '/share/';

const SHARE_PARAM_PREFIX = '?shareId=';

module.exports = new Router(

).post('create_imgs', async ctx => {

    let params = ctx.request.body;
    if (!params || !params.imgIds || !Array.isArray(params.imgIds) || params.imgIds.length == 0)
        return baseController.response400(ctx, '缺失参数或参数错误: imgIds');

    let imgs = await imagesModel.selectOwnByIds(params.imgIds, ctx.state.authInfo.id);
    if (!imgs || imgs.length != params.imgIds.length) return baseController.response400(ctx, '存在无效的imgId 或指定的imgId无权操作');

    // 保存分类清单
    let shareId = (await shareListModel.save({
        userId: ctx.state.authInfo.id,
        type: 'image',
        status: true
    }))._id;

    if (!shareId) return baseController.response500(ctx);

    for (let index = 0; index < imgs.length; index++) {
        await shareImgModel.save({
            imgId: imgs[index]._id,
            shareId: shareId,
            status: true,
            urn: util.md5(imgs[index].urn + Date.now())
        });
    }

    baseController.response(ctx, '处理完成', {
        shareId: shareId,
        url: baseConfig.imgUri + SHARE_PREFIX + shareId
    })

}).post('create_sort', async ctx => {

    let params = ctx.request.body;
    if (!params || !params.sortId) return baseController.response400(ctx, '缺失参数或参数错误: sortId');

    let sort = await sortsModel.selectByCondition({
        userId: ctx.state.authInfo.id,
        _id: params.sortId
    });

    if (!sort) {
        return baseController.responseWithCode(ctx, baseController.CODE.UNKNOWN_SORT_ID, '无效的sortId');
    }

    if (sort.shared) { // 严格意义上这里存在非线程安全的并发问题
        return baseController.responseWithCode(ctx, baseController.CODE.SHARED_SORT_ID, '该分类已经分享', {
            shareId: shareId,
            url: baseConfig.shareUri + SHARE_PARAM_PREFIX + shareId
        });
    }

    let images = await imagesModel.selectByCondition({
        userId: ctx.state.authInfo.id,
        sortId: params.sortId
    });

    if (!images || images.length == 0) {
        return baseController.responseWithCode(ctx, baseController.CODE.NOT_EXISTED_ANY_IMG, '该分类下无任何图片');
    }

    let shareId = (await shareListModel.save({
        userId: ctx.state.authInfo.id,
        type: 'sort',
        status: true,
        sortId: params.sortId
    }))._id;

    // 更新分类分享状态为已分享
    await sortsModel.updateOwnById({
        shared: true,
        shareId: shareId,
    }, params.sortId, ctx.state.authInfo.id);

    let array = [];
    for (let len = images.length, index = 0; index < len; index++) {
        array.push({
            imgId: images[index]._id,
            shareId: shareId,
            status: true,
            urn: util.md5(images[index].urn + Date.now())
        });
    }

    await shareImgModel.saveMany(array);

    baseController.response(ctx, '分享成功（仅分享分类当前含有的图片, 后续图片不会自动分享）', {
        shareId: shareId,
        url: baseConfig.shareUri + SHARE_PARAM_PREFIX + shareId
    });

}).get('query', async ctx => { // 通过分享Id查询该分享的具体分享图片

    let params = ctx.query;

    if (!params || !params.shareId) return baseController.response400(ctx, '无效的shareId');
    if (params.shareId.length != 12 && params.shareId.length != 24) {
        return baseController.response400(ctx, '无效的shareId');
    }

    let shareList = await shareListModel.selectOneById(params.shareId);
    if (!shareList) {
        return baseController.responseWithCode(ctx, baseController.CODE.INVALID_SHARE_ID, '无效的shareId');
    }

    if (!shareList.status) {
        return baseController.responseWithCode(ctx, baseController.CODE.EXPIRED_SHARE, '该分享已经失效');
    }


    let shareUser = await userModel.selectById(shareList.userId);
    let shareUsername;

    if (!shareUser.nickname) {
        shareUsername = shareUser.username.replace(baseController.REG.USERNAME_ENCODE, "$1**$2");
    } else {
        shareUsername = shareUser.nickname;
    }

    let shareImgs = await shareImgModel.selectManyByCondition({
        shareId: params.shareId
    });

    let array = [];
    for (let len = shareImgs.length, i = 0; i < len; i++) {
        array.push(baseConfig.imgUri + SHARE_PREFIX + shareImgs[i].urn);
    }

    baseController.response(ctx, {
        sharedUrls: array,
        shareUser: shareUsername
    });

}).delete('del', async ctx => {

    let params = ctx.query;
    if (!params || !params.shareId) return baseController.response400(ctx, '无效的shareId');

    if (params.shareId.length != 12 && params.shareId.length != 24) {
        return baseController.response400(ctx, '不合法的shareId');
    }

    let shareList = await shareListModel.selectOneOfOwnById(params.shareId, ctx.state.authInfo.id);
    if (!shareList.status) {
        return baseController.responseWithCode(ctx, baseController.CODE.EXPIRED_SHARE, '该分享已经失效');
    }

    await shareImgModel.updateManyByShareId(params.shareId, {
        status: false
    });

    if (shareList.type === 'sort') {
        await sortsModel.updateForDelShare(shareList.sortId);
    }

    await shareListModel.updateById({
        status: false
    }, params.shareId);

    baseController.response(ctx);
}).routes();