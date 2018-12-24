/**
 * @Author: acexy@thankjava.com
 * 2018/7/26
 * @Description:
 */

const Router = require('koa-router');

const authTokenModel = require('../models/authToken');
const baseController = require('./baseController');
const asyncRedisClient = require('../lib/asyncRedis').client;
const redisKey = require('../const/redisKey');


module.exports = new Router(

).get('list', async ctx => {
    let userId = ctx.state.authInfo.id;
    let tokens = await authTokenModel.selectByUserIdSortByCreateTimeDesc(userId);
    if (tokens) {

        let now = Date.now();
        let expirationTokenId = [];
        let expirationToken = [];

        for (let index in tokens) {
            if (now >= tokens[index].expiration) {
                expirationTokenId.push(tokens[index]._id.toString());
                expirationToken.push(tokens[index].token);
                delete tokens[index];
                continue;
            }
            tokens[index].token = tokens[index].token.replace(baseController.REG.TOKEN_ENCODE, '$1******$2');
            delete tokens[index].userId;
        }

        tokens = tokens.filter(token => {
            if (token) return token;
        });

        if (expirationTokenId.length > 0) {
            await authTokenModel.removeOwnByIds(expirationTokenId, userId);
            for (let index in expirationToken) {
                await asyncRedisClient.delAsync(redisKey.AUTH_TOKEN(expirationToken[index].token));
            }
        }

        return baseController.response(ctx, {list: tokens});
    }
    baseController.response(ctx);
}).post('del', async ctx => {
    let params = ctx.request.body;
    if (!params || !params.ids) return baseController.response400(ctx);
    let userId = ctx.state.authInfo.id;
    let tokens = await authTokenModel.selectOwnByIds(params.ids, userId);
    for (let index in tokens) {
        await asyncRedisClient.delAsync(redisKey.AUTH_TOKEN(tokens[index].token));
    }
    await authTokenModel.removeOwnByIds(params.ids, userId);
    baseController.response(ctx);
}).routes();