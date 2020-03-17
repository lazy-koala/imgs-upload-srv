/**
 * @Author:acexy@thankjava.com
 * 2018/5/28
 * @Description:
 */

const code = require('../const/code');
const reg = require('../const/reg');

/**
 * 移除cookie
 * @param ctx
 * @param cookieNames
 */
module.exports.removeCookie = (ctx, cookieNames) => {
    if (Array.isArray(cookieNames)) {
        cookieNames.every((element) => {
            ctx.cookies.set(element, null);
            return true;
        })
    }
    ctx.cookies.set(cookieNames, null);
};

/**
 * 获取cookie
 * @param ctx
 * @param cookieName
 * @returns {*}
 */
module.exports.getCookie = (ctx, cookieName) => ctx.cookies.get(cookieName);

// 设置cookie
module.exports.setCookie = (ctx, cookieName, value, option) => {
    ctx.cookies.set(cookieName, value, option);
};

/**
 * 响应请求参数错误
 * @param ctx
 * @param message
 */
module.exports.response400 = (ctx, message) => {
    ctx.response.status = 400;
    ctx.body = responseBuilder(undefined, message ? message : '请求参数错误');
};

/**
 * 响应处理失败的请求
 * @param ctx
 * @param message
 */
module.exports.response500 = (ctx, message) => {
    ctx.response.status = 500;
    ctx.body = responseBuilder(undefined, message ? message : '系统异常');
};

/**
 * 响应正常请求
 * @param ctx
 * @param message
 * @param data
 */
module.exports.response = (ctx, message, data) => {
    ctx.body = responseBuilder(undefined, message, data);
};

/**
 * 响应含有code的正常请求
 * @param ctx
 * @param code
 * @param message
 * @param data
 */
module.exports.responseWithCode = (ctx, code, message, data) => {
    ctx.body = responseBuilder(code, message, data);
};

// 创建返回对象数据
const responseBuilder = (code, message, data) => {

    if (code) {
        if (!data && typeof message !== 'string') {
            data = message;
            message = undefined;
        }
    }

    return {
        code: code,
        message: message || '请求完成',
        data: data
    };
};

module.exports.CODE = code;
module.exports.REG = reg;

module.exports.CONSTS = {
    AUTH_COOKIE_EXPIRES_DAY: 30,        // 认证cookie的过期时间 (天)
    SHORT_AUTH_COOKIE_EXPIRES_DAY: 0.1, // 非长期登录的token过期时间
    REG_MAIL_MINUTE: 15,                // 注册邮件验证码邮箱时间
    FORGET_MAIL_MINUTE: 15,             // 忘记密码邮件验证码邮箱时间
    MAX_LIVING_TOKEN_NUMBER: 10,         // 最大长期登录的token数
    UPDATE_MAIL_MINUTE: 15,             // 修改邮箱验证时间
};