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

}).delete('del', async ctx => {

}).routes();