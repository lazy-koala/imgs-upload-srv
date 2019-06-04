/**
 * @Author: acexy@thankjava.com
 * 2019/4/25
 * @Description: 处理分类
 */
const Router = require('koa-router');
const imagesModel = require('../models/images');
const baseController = require('./baseController');

module.exports = new Router(

).post('add', async ctx => {

    let params = ctx.request.body;

    if (!params) return baseController.response400(ctx);
    if (!params.tags || params.tags.length == 0) return baseController.response400(ctx, '缺失参数: tags');
    if (!params.imgId) return baseController.response400(ctx, '缺失参数: imgId');
    if (params.imgId.length != 12 && params.imgId.length != 24) {
        return baseController.responseWithCode(ctx, baseController.CODE.BAD_OBJECT_ID, '不合法的imgId')
    }

    let image = await imagesModel.selectOwnByIds(params.imgId, ctx.state.authInfo.id);
    if (!image || image.length == 0) return baseController.responseWithCode(ctx, baseController.CODE.UNKNOWN_IMG_ID, '无效的imgId');

    image = image[0];

    for (let i = 0; i < params.tags.length; i++) {
        if (image.tags.indexOf(params.tags[i]) != -1) {
            return baseController.responseWithCode(ctx, baseController.CODE.EXISTS_IMG_TAG, '已存在的标签: ' + params.tags[i]);
        }
    }

    if (image.tags.length != 0) {

        if (image.tags.length >= 3 || image.tags.length + params.tags.length > 3) {
            return baseController.responseWithCode(ctx, baseController.CODE.MAX_IMG_TAG, "标签超出上限");
        }

        params.tags.push.apply(params.tags, image.tags);

    } else {
        if (params.tags.length >= 3) {
            return baseController.responseWithCode(ctx, baseController.CODE.MAX_IMG_TAG, "标签超出上限");
        }
    }

    await imagesModel.updateById({
        tags: params.tags
    }, params.imgId);

    baseController.response(ctx);

}).routes();