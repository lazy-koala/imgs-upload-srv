/**
 * @Author: acexy@thankjava.com
 * 2019/4/25
 * @Description: 处理分享
 */
const Router = require('koa-router');
const imagesModel = require('../models/images');
const shareListModel = require('../models/shareList');
const shareImgModel = require('../models/shareImg');
const baseController = require('./baseController');
const util = require('../lib/util');

module.exports = new Router(

).get('create_imgs', async ctx => {

    let params = ctx.request.body;
    if (!params || !params.imgIds || !Array.isArray(params.imgIds) || params.imgIds.length == 0)
        return baseController.response400(ctx, '缺失参数或参数错误: imgIds');

    let imgs = await imagesModel.selectOwnByIds(params.imgIds, ctx.state.authInfo.id);
    if (!imgs || imgs.length != params.imgIds.length) return baseController.response400(ctx, '存在无效的imgId 或指定的imgId无权操作');

    // 保存分类清单
    let shareId = (await shareListModel.save({
        userId: ctx.state.authInfo.id,
        type: 'image'
    }))._id;

    if (!shareId) return baseController.response500(ctx);

    for (let index = 0; index < imgs.length; index++) {
        await shareImgModel.save({
            imgId: imgs[index]._id,
            shareId: shareId,
            urn: '/' + util.md5(imgs[index].urn + Date.now())
        })
    }

    baseController.response(ctx, '处理完成', {shareId: shareId})

}).routes();