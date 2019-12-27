/**
 * @Author:acexy@thankjava.com
 * 2018/6/14
 * @Description:图片相关处理
 */
const Router = require('koa-router');
const uploadConfig = require('../config/upload');
const baseConfig = require('../config/basic');

const busboyUpload = require('../lib/busboyUpload');
const baseController = require('./baseController');
const imagesModel = require('../models/images');
const sortsModel = require('../models/sorts');
const shareImgModel = require('../models/shareImg');

const asyncRedisClient = require('../lib/asyncRedis').client;
const redisKey = require('../const/redisKey');

const algorithm10to64 = require('../lib/algorithm10to64');
const util = require('../lib/util');

let defaultSortId;

module.exports = new Router(

).post('upload', async (ctx) => {

    let uploadResult = await busboyUpload.upload(ctx);
    if (!uploadResult.flag) return baseController.response500(ctx, '图片上传异常');
    let fields = uploadResult.fields;
    uploadResult = uploadResult.uploadResult;
    let sortId;
    if (!fields || !fields.sortId) {
        if (!defaultSortId) {
            defaultSortId = (await sortsModel.selectOneByUserId('system'))._id.toString();
        }
        sortId = defaultSortId;
    } else {
        sortId = fields.sortId;
    }
    let saveImages = [];
    let userId = ctx.state.authInfo.id;

    let incr;

    // TODO : 此处图片上传设计为多张, 但是标签和分类只设计传一张, 所以上传暂时约定一张一张上传
    for (let index in uploadResult) {

        incr = await asyncRedisClient.incrAsync(redisKey.IMG_INCR_NO());

        if (uploadResult[index].flag) {
            let img = {
                userId: userId,
                url: uploadResult[index].path,
                urn: '/' + algorithm10to64.number10to64(incr + Date.now()),
                sortId: sortId
            };
            if (fields && fields.tags && fields.tags.length > 0) {
                img.tags = fields.tags;
            }
            saveImages.push(img);

            uploadResult[index].path = baseConfig.imgUri + img.urn;
        }
    }

    if (saveImages.length > 0) {
        let result = await imagesModel.saveMany(saveImages);
        if (result.length > 0) {
            // 自动进行分享
            // FIXME 如果多张图片上传这里是有问题的
            if (sortId !== defaultSortId) {
                let img = result[0];
                let sort = await sortsModel.selectOwnById(sortId, userId);
                if (sort.shared) {
                    await shareImgModel.save({
                        imgId: String(img._id),
                        shareId: sort.shareId,
                        status: true,
                        urn: util.md5(img.urn + Date.now())
                    });
                }
            }
        } else {
            return baseController.response400(ctx, '请求参数异常')
        }
    } else {
        return baseController.response400(ctx, '请求参数异常')

    }


    baseController.response(ctx, uploadResult);

}).get('list', async ctx => {

    let page = ctx.query;
    if (!page) return baseController.response400(ctx, '请求参数缺失');
    let pageSize = page.pageSize;
    let pageNumber = page.pageNumber;
    if (!pageNumber) return baseController.response400(ctx, '缺失参数: pageNumber');
    if (pageSize < 1 || pageNumber < 1) return baseController.response400(ctx, '请求参数不合法');

    page.pageSize = Number(pageSize);
    page.pageNumber = Number(pageNumber);
    page.query = {
        userId: ctx.state.authInfo.id
    };

    if (page.sortId) {
        page.query.sortId = page.sortId
    }

    if (page.tag && Array.isArray(page.tag) && page.tag.length > 0) {
        let likeConditionArray = [];
        for (let i = 0; i < page.tag.length; i++) {
            likeConditionArray.push({'tags': {'$regex': page.tag[i]}});
        }
        page.query["$or"] = likeConditionArray;
    } else if (page.tag && typeof page.tag == 'string') {
        page.query["$or"] = [{'tags': {'$regex': page.tag}}];
    }

    let response = await imagesModel.selectByPage(page);
    if (!response) return baseController.response500(ctx);
    if (response.list) {
        let list = response.list;
        for (let index = 0; index < list.length; index++) {
            list[index]._doc.suffix = list[index].url.split('.')[1];
            list[index].url = baseConfig.imgUri + list[index].urn; // 拼装图片服务器主域名
        }
    }
    baseController.response(ctx, response);

}).post('del', async (ctx) => {

    let params = ctx.request.body;
    if (!params) return baseController.response400(ctx, '请求参数缺失');
    if (!params.ids || params.ids.length == 0) return baseController.response400(ctx, '请求参数异常');
    let ids = params.ids;
    let imgs = await imagesModel.selectOwnByIds(ids, ctx.state.authInfo.id); // 防止删除别人的数据
    if (!imgs) return baseController.response(ctx);
    let uriArray = [];
    for (let i in imgs) {
        uriArray.push(uploadConfig.path + imgs[i].url); // 得到有效的需要删除的 物理路径图片位置
    }
    util.fsDel(uriArray); // 异步移除图片

    await imagesModel.removeOwnManyById(ids, ctx.state.authInfo.id);        // 清除数据库记录
    await shareImgModel.updateManyByImgId(ids, {status: false});    // 清楚分享的记录

    baseController.response(ctx);

}).post('update', async ctx => {

    let params = ctx.request.body;

    if (!params) return baseController.response400(ctx);
    if (!params.imgId) return baseController.response400(ctx, '缺失参数: imgId');
    if (params.imgId.length != 12 && params.imgId.length != 24) {
        return baseController.responseWithCode(ctx, baseController.CODE.BAD_OBJECT_ID, '不合法的imgId')
    }

    if (!params.sortId && (!params.tags || params.tags.length == 0)) return baseController.response400(ctx, '缺失参数: tags|sortId不能同时为空');


    let image = await imagesModel.selectOwnByIds(params.imgId, ctx.state.authInfo.id);
    if (!image || image.length == 0) return baseController.responseWithCode(ctx, baseController.CODE.UNKNOWN_IMG_ID, '无效的imgId');

    if (params.tags.length > 3) {
        return baseController.responseWithCode(ctx, baseController.CODE.MAX_IMG_TAG, "标签超出上限");
    }

    let sortTag = params.tags;
    for (let i = 0; i < sortTag.length - 1; i++) {
        if (sortTag[i] == sortTag[i + 1]) {
            return baseController.responseWithCode(ctx, baseController.CODE.EXISTS_IMG_TAG, '存在相同的标签: ' + params.tags[i]);
        }
    }

    let update = {
        tags: params.tags
    };

    if (params.sortId) {
        update.sortId = params.sortId
    }

    await imagesModel.updateById(update, params.imgId);

    baseController.response(ctx);

}).get('refresh_uri', async ctx => {

    let param = ctx.query;
    if (!param || !param.imgId) return baseController.response400(ctx, '缺失参数: imgId');
    let image = await imagesModel.selectOwnByIds(params.imgId, ctx.state.authInfo.id);
    if (!image) return baseController.responseWithCode(ctx, baseController.CODE.UNKNOWN_IMG_ID, '无效的imgId');
    let urn = '/' + algorithm10to64.number10to64((await asyncRedisClient.incrAsync(redisKey.IMG_INCR_NO())) + Date.now());
    await imagesModel.updateById({
        urn: urn
    }, image._id);

    baseController.response(ctx, "请求完成", {
        uri: baseConfig.imgUri + urn
    })
}).routes();
