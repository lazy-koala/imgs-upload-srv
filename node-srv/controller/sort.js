/**
 * @Author: acexy@thankjava.com
 * 2019/4/25
 * @Description: 处理分类
 */
const Router = require('koa-router');
const sortModel = require('../models/sort');
const baseController = require('./baseController');

module.exports = new Router(

).post('add', async ctx => {

    let params = ctx.request.body;
    if (!params) return baseController.response400(ctx);
    if (!params.sortName) return baseController.response400(ctx, '缺失参数: sortName');

    await sortModel.save({
        userId: ctx.state.authInfo.id,
        sortName: params.sortName
    });

    baseController.response(ctx);

}).post('update', async ctx => {

    let params = ctx.request.body;
    if (!params) return baseController.response400(ctx);
    if (!params.sortName || !params.sortId) return baseController.response400(ctx, '缺失参数: sortName | sortId');

    if (params.sortId.length != 12 && params.sortId.length != 24) {
        return baseController.responseWithCode(ctx, baseController.CODE.BAD_OBJECT_ID, '不合法的sortId')
    }
    let sort = await sortModel.selectById(params.sortId);
    if (!sort) {
        return baseController.responseWithCode(ctx, baseController.CODE.UNKNOWN_SORT_ID, '无效的sortId');
    }

    await sortModel.updateById({
        sortName: params.sortName,
    }, params.sortId);


    baseController.response(ctx);

}).delete('del', async ctx => {
    let params = ctx.query;
    if (!params) return baseController.response400(ctx);
    if (!params.sortId) return baseController.response400(ctx, '缺失参数: sortId');
    if (params.sortId.length != 12 && params.sortId.length != 24) {
        return baseController.responseWithCode(ctx, baseController.CODE.BAD_OBJECT_ID, '不合法的sortId')
    }
    await sortModel.removeById(params.sortId);
    baseController.response(ctx);
}).routes();