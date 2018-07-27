/**
 * @Author:acexy@thankjava.com
 * 2018/6/12
 * @Description:鉴权中间件
 */

const url = require('url');

const asyncRedisClient = require('../lib/asyncRedis').client;
const redisKey = require('../const/redisKey');
const cookiesName = require('../const/cookiesName');
const whitePathname = require('../const/whitePathname');

module.exports = async (ctx, next) => {

    if (!auth(url.parse(ctx.url, true).pathname)) {
        // 是否需要鉴权
        let token = ctx.cookies.get(cookiesName.COOKIE_NAME_TOKEN);
        let uinfo = ctx.cookies.get(cookiesName.COOKIE_NAME_UINFO);
        if (token && uinfo) {

            let userInfo = await asyncRedisClient.getAsync(redisKey.AUTH_TOKEN(token));
            if (!userInfo) { // 鉴权失败
                ctx.body = {message: 'unauthorized'};
                ctx.status = 401;
                return;
            }

            userInfo = JSON.parse(userInfo);

            if (JSON.parse(decodeURI(uinfo)).id != userInfo.id) {
                ctx.body = {message: 'unauthorized'};
                ctx.status = 401;
                return;
            }

            ctx.state.authInfo = userInfo;

        } else {
            // 鉴权参数不足
            ctx.body = {message: 'unauthorized'};
            ctx.status = 401;
            return;
        }
    }

    // 鉴权完成的用户上下文中添加用户信息
    await next();
};

const auth = pathname => {
    for (let index in whitePathname) {
        if (pathname.startsWith(whitePathname[index])) {
            return true;
        }
    }
    return false;
};