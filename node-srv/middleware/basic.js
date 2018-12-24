/**
 * @Author:acexy@thankjava.com
 * 2018/6/12
 * @Description:基础中间件
 */

const unlogPathname = require('../const/unlogPathname');
const url = require('url');


module.exports = async (ctx, next) => {

    let startTime = beforeController(ctx);
    await next();
    afterController(ctx, startTime);

};

const beforeController = ctx => {
    let requestContent = '';
    if (ctx.method == "GET") {
        requestContent = ctx.query ? JSON.stringify(ctx.query) : 'null';
    } else if (ctx.method == "POST") {
        requestContent = ctx.request.body ? JSON.stringify(ctx.request.body) : 'null';
    }

    if (!unlog(url.parse(ctx.url, true).pathname)) {
        let logInfo = '=> koa: '.cyan + '<<< requestContent = '.grey + requestContent.blue + ' | url = '.grey + ctx.url.blue;
        console.log(logInfo);
    }

    return Date.now();
};

/**
 * 公共处理 controller 完毕后执行
 * @param ctx
 */
const afterController = (ctx, startTime) => {

    if (ctx.response.status == 404) {
        ctx.body = {message: '404 Or Invalid Response'};
    } else if (ctx.response.status == 405) {
        ctx.body = {message: '405 Method Not Allowed'};
    }

    if (!unlog(url.parse(ctx.url, true).pathname))  {
        let logInfo = '=> koa: '.cyan + '>>> responseContent = '.grey + '%s' + ' | url = '.grey + '%s'.blue;
        logInfo += ' | status = '.grey + '%s'.blue + ' | costTime = '.grey + '%s'.blue + ' ms'.grey;

        console.log(logInfo, ctx.body ? JSON.stringify(ctx.body).blue : 'no data response'.red, ctx.url, ctx.response.status, Date.now() - startTime);
    }

};

const unlog = pathname => {
    for (let index in unlogPathname) {
        if (pathname.startsWith(unlogPathname[index])) {
            return true;
        }
    }
    return false;
};