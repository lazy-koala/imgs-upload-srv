/**
 * @Author: acexy@thankjava.com
 * 2018/7/26
 * @Description:
 */

const Router = require('koa-router');

const authTokenModel = require('../models/authToken');
const baseController = require('./baseController');

module.exports = new Router(

).get('list', async ctx => {
    let userId = ctx.state.authInfo.id;
    let tokens = await authTokenModel.selectByUserIdSortByCreateTime(userId);
    if (tokens) {
        for (let index in tokens) {
            tokens[index].token = tokens[index].token.replace(baseController.REG.TOKEN_ENCODE, '$1******$2');
        }
        return baseController.response(ctx, {list: tokens});
    }
    baseController.response(ctx);
}).post('del', async ctx => {
    let params = ctx.request.body;
    if (!params || !params.ids) return baseController.response400(ctx);
    let userId = ctx.state.authInfo.id;
    await authTokenModel.removeOwnByIds(params.ids, userId);
    baseController.response(ctx);
}).routes();