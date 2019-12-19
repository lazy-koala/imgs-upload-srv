/**
 * @Author: acexy@thankjava.com
 * 2019/4/25
 * @Description: 处理分类
 */
const Router = require('koa-router');
const sortsModel = require('../models/sorts');
const imagesModel = require('../models/images');
const defaultLoadSortIdModel = require('../models/defaultLoadSortId');
const baseController = require('./baseController');
const baseConfig = require('../config/basic');

const SHARE_PARAM_PREFIX = '?shareId=';

let defaultSort;
module.exports = new Router(

).post('add', async ctx => {

    let params = ctx.request.body;
    if (!params) return baseController.response400(ctx);
    if (!params.sortName) return baseController.response400(ctx, '缺失参数: sortName');

    let sorts = await sortsModel.selectByCondition({
        userId: ctx.state.authInfo.id,
        sortName: params.sortName
    });
    if (sorts && sorts.length > 0) {
        return baseController.response(ctx, baseController.CODE.EXISTING_SORT_NAME, '已存在的分类名称');
    }
    await sortsModel.save({
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
    let sort = await sortsModel.selectById(params.sortId);
    if (!sort) {
        return baseController.responseWithCode(ctx, baseController.CODE.UNKNOWN_SORT_ID, '无效的sortId');
    }

    await sortsModel.updateOwnById({
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
        if (!defaultSort) {
            defaultSort = await sortsModel.selectOneByUserId('system');
        }
        await imagesModel.updateByCondition({
            sortId: defaultSort._id
        }, {
            userId: ctx.state.authInfo.id,
            sortId: params.sortId
        });
        message = '删除成功,相关图片已归档至默认分类';
    }

    await sortsModel.removeOwnById(params.sortId, ctx.state.authInfo.id);

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
    if (!defaultSort) {
        defaultSort = await sortsModel.selectOneByUserId('system');
    }
    let array = [{
        sortId: defaultSort._id,
        sortName: defaultSort.sortName,
        createTime: defaultSort.createTime,
        shared: false
    }];

    let sorts = await sortsModel.selectByCondition(condition);
    if (sorts && sorts.length > 0) {

        for (let i = 0; i < sorts.length; i++) {
            let obj = {
                sortId: sorts[i]._id,
                sortName: sorts[i].sortName,
                createTime: sorts[i].createTime,
                shared: sorts[i].shared == null ? false : sorts[i].shared,
                shareId: sorts[i].shareId
            };
            if (obj.shared) {
                obj.shareUrl = baseConfig.shareUri + SHARE_PARAM_PREFIX + sorts[i].shareId

            }
            array.push(obj)
        }
    }
    return baseController.response(ctx, {
        list: array,
        defaultLoadSortId: (await defaultLoadSortIdModel.selectOneByOwnId(userId)).sortId
    });

}).post('set_default_load_sort_id', async ctx => {

    let params = ctx.request.body;
    if (!params) return baseController.response400(ctx);
    let userId = ctx.state.authInfo.id;

    if (!params.sortId) {
        await defaultLoadSortIdModel.removeOwnById(userId);
        return baseController.response(ctx);
    }
    let sortId = params.sortId;


    let defaultSort = await defaultLoadSortIdModel.selectOneByOwnId(userId);
    if (defaultSort && defaultSort.sortId) {
        console.log('已存在默认设置执行更新: ' + defaultSort.sortId);
        await defaultLoadSortIdModel.updateOwnById(sortId, userId);
    } else {
        console.log('不存在默认设置, 保存当前配置' + sortId);
        await defaultLoadSortIdModel.save(userId, sortId);
    }

    baseController.response(ctx);

}).routes();