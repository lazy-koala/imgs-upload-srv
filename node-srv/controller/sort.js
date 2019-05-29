/**
 * @Author: acexy@thankjava.com
 * 2019/4/25
 * @Description: 处理分类
 */
const Router = require('koa-router');
const sortModel = require('../models/sort');
const imagesModel = require('../models/images');
const baseController = require('./baseController');

module.exports = new Router(

).post('add', async ctx => {

    let params = ctx.request.body;
    if (!params) return baseController.response400(ctx);
    if (!params.sortName) return baseController.response400(ctx, '缺失参数: sortName');

    let sorts = await sortModel.selectByCondition({
        userId: ctx.state.authInfo.id,
        sortName: params.sortName
    });
    if (sorts && sorts.length > 0) {
        return baseController.response(ctx, baseController.CODE.EXISTING_SORT_NAME, '已存在的分类名称');
    }
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

    await sortModel.updateOwnById({
        sortName: params.sortName,
    }, params.sortId, ctx.state.authInfo.id);


    baseController.response(ctx);

}).delete('del', async ctx => {
    let params = ctx.query;
    if (!params) return baseController.response400(ctx);
    if (!params.sortId) return baseController.response400(ctx, '缺失参数: sortId');
    if (params.sortId.length != 12 && params.sortId.length != 24) {
        return baseController.responseWithCode(ctx, baseController.CODE.BAD_OBJECT_ID, '不合法的sortId')
    }
    let imgs = await imagesModel.selectByCondition({
        userId: ctx.state.authInfo.id,
        sortId: params.sortId
    });

    let message = '删除成功';

    if (imgs && imgs.length > 0) {
        await imagesModel.updateByCondition({
            sortId: await sortModel.selectOneByUserId('system')._id
        }, {
            userId: ctx.state.authInfo.id,
            sortId: params.sortId
        });
        message = '删除成功,相关图片已归档至默认分类';
    }

    await sortModel.removeOwnById(params.sortId, ctx.state.authInfo.id);

    baseController.response(ctx, message);
}).get('list', async ctx => {

    let params = ctx.query;
    if (!params) return baseController.response400(ctx);
    let userId = ctx.state.authInfo.id;
    let condition = {
        userId: userId
    };
    if (params.sortName) {
        condition.sortName = {$regex: '/' + params.sortName + '/'}
    }
    if (params.sortId) {
        condition.sortId = params.sortId;
    }
    let sorts = await sortModel.selectByCondition(condition);
    if (sorts && sorts.length > 0) {
        let array = [];
        for (let i = 0; i < sorts.length; i++) {
            array.push({
                sortId: sorts[i]._id,
                sortName: sorts[i].sortName,
                createTime: sorts[i].createTime
            })
        }
        return baseController.response(ctx, {list: array});
    }
    baseController.response(ctx);

}).routes();