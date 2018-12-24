/**
 * @Author:acexy@thankjava.com
 * 2018/6/13
 * @Description:登录相关处理
 */

const Router = require('koa-router');

const cookiesName = require('../const/cookiesName');
const baseController = require('./baseController');
const util = require('../lib/util');
const asyncRedisClient = require('../lib/asyncRedis').client;
const redisKey = require('../const/redisKey');
const userModel = require('../models/user');
const authTokenModel = require('../models/authToken');
const mailSender = require('../lib/mailSender');
const mailType = require('../const/mailType');
const imagesModel = require('../models/images');
const fs = require('fs');
const uploadConfig = require('../config/upload');


module.exports = new Router(

).post('login', async (ctx) => {

    // 登录
    let params = ctx.request.body;
    if (!params || Object.keys(params).length == 0) {
        return baseController.response400(ctx);
    }

    let username = params.username;
    let password = params.password;
    let keepLogged = params.keepLogged;

    if (!username || !password) {
        return baseController.response400(ctx, '帐号或密码为空');
    }

    let info = await userModel.selectByUsernameOrEmail(username);
    if (!info) {
        return baseController.responseWithCode(ctx, baseController.CODE.INVALID_ACCOUNT, '账号不存在');
    }

    if (util.md5(info.username + password) != info.password) {
        return baseController.responseWithCode(ctx, baseController.CODE.PASSWORD_ERROR, '密码错误');
    }

    let nowTime = Date.now();
    let token = util.md5(util.uuid() + nowTime + username);

    await doLogin(ctx, info, keepLogged, token, nowTime);

    baseController.response(ctx);

}).get('logout', async (ctx) => {

    let token = baseController.getCookie(ctx, cookiesName.COOKIE_NAME_TOKEN);
    let uinfo = baseController.getCookie(ctx, cookiesName.COOKIE_NAME_UINFO);
    if (token) {
        await asyncRedisClient.delAsync(redisKey.AUTH_TOKEN(token));
        await authTokenModel.removeOwnByTokens(token, JSON.parse(decodeURI(uinfo)).id);
    }

    baseController.removeCookie(ctx, [
        cookiesName.COOKIE_NAME_TOKEN,
        cookiesName.COOKIE_NAME_UINFO
    ]);

    baseController.response(ctx);

}).post('registe', async ctx => {

    let params = ctx.request.body;

    if (!params) return baseController.response400(ctx);
    if (!params.username || !params.password || !params.mail || !params.mailCode || !params.token) {
        return baseController.response400(ctx);
    }

    if (!params.nickname) params.nickname = '新用户';

    if (!baseController.REG.USERNAME.test(params.username)) return baseController.response400(ctx, '用户名不合法');
    if (!baseController.REG.PASSWORD.test(params.password)) return baseController.response400(ctx, '密码不合法');
    if (!baseController.REG.IS_MAIL.test(params.mail)) return baseController.response400(ctx, '邮箱不合法');

    let user = await userModel.selectByUsernameOrEmail(params.mail);
    if (user) return baseController.responseWithCode(ctx, baseController.CODE.EXISTING_MAIL, '用户邮箱已存在');
    user = await userModel.selectByUsernameOrEmail(params.username);
    if (user) return baseController.responseWithCode(ctx, baseController.CODE.EXISTING_USERNAME, '用户账号已存在');

    let codeInfo = await asyncRedisClient.getAsync(redisKey.REG_MAIL_CODE(params.token));
    if (!codeInfo) return baseController.responseWithCode(ctx, baseController.CODE.EXPIRED_MAIL_CODE, '验证码已过期或未获取验证码');
    codeInfo = codeInfo.split('|');

    if (params.mailCode != codeInfo[0]) return baseController.responseWithCode(ctx, baseController.CODE.INVALID_MAIL_CODE, '邮箱验证码错误');

    if (params.username != codeInfo[1] || params.mail != codeInfo[2]) return baseController.responseWithCode(ctx, baseController.CODE.ERROR_REGISTE_DATA, '该验证码仅可用于邮件指定的帐号注册使用');

    try {
        let info = await userModel.save({
            username: params.username,
            password: util.md5(params.username + params.password),
            email: params.mail,
            nickname: params.nickname
        });

        let nowTime = Date.now();
        let token = util.md5(util.uuid() + nowTime + params.username);

        await doLogin(ctx, info, false, token, nowTime);

    } catch (e) {
        console.error(e);
        return baseController.response500(ctx, '注册失败，请重试');
    }

    await asyncRedisClient.delAsync(redisKey.REG_MAIL_CODE(params.token));

    baseController.response(ctx);

}).post('send_reg_mail_code', async ctx => {

    let params = ctx.request.body;
    if (!params) return baseController.response400(ctx);
    if (!params.username || !params.mail) return baseController.response400(ctx);
    if (!params.nickname) params.nickname = '新用户';
    if (!baseController.REG.IS_MAIL.test(params.mail)) return baseController.response400(ctx, '邮箱地址不合法');
    let user = await userModel.selectByUsernameOrEmail(params.mail);
    if (user) return baseController.responseWithCode(ctx, baseController.CODE.EXISTING_MAIL, '用户邮箱已存在');
    user = await userModel.selectByUsernameOrEmail(params.username);
    if (user) return baseController.responseWithCode(ctx, baseController.CODE.EXISTING_USERNAME, '用户账号已存在');

    let code = util.randomNum(6);
    let data = [
        params.nickname,
        params.username,
        code
    ];

    let flag = await mailSender.send(mailType.type.REGISTE_CODE, params.mail, data);
    if (!flag) return baseController.responseWithCode(ctx, baseController.CODE.SEND_MAIL_FAILED, '邮件发送失败，请检查你的邮箱或重试'); // 邮件发送失败

    let token = util.uuid();

    await asyncRedisClient.setAsync(redisKey.REG_MAIL_CODE(token), code + '|' + params.username + '|' + params.mail, 'EX', baseController.CONSTS.REG_MAIL_MINUTE * 60);

    return baseController.response(ctx, {
        token: token
    });

}).post('forget_pwd', async ctx => {

    let params = ctx.request.body;
    if (!params) return baseController.response400(ctx);
    if (!params.username || !params.mail) return baseController.response400(ctx);
    if (!baseController.REG.IS_MAIL.test(params.mail)) return baseController.response400(ctx, '邮箱地址不合法');

    let user = await userModel.selectByConditionOnlyOne({
        username: params.username,
        email: params.mail
    });

    if (!user) return baseController.responseWithCode(ctx, baseController.CODE.ERROR_ACCOUNT_OR_EMAIL, '无效的邮箱或者帐号');

    let code = util.randomNum(6);
    let data = [
        user.nickname,
        params.username,
        code
    ];

    let flag = await mailSender.send(mailType.type.FORGET_CODE, params.mail, data);
    if (!flag) return baseController.response(ctx, baseController.CODE.SEND_MAIL_FAILED, '邮件发送失败，请检查你的邮箱或重试');

    let token = util.uuid();

    await asyncRedisClient.setAsync(redisKey.FORGET_MAIL_CODE(token), code + '|' + params.username, 'EX', baseController.CONSTS.FORGET_MAIL_MINUTE * 60);

    baseController.response(ctx, {
        token: token
    });

}).post('reset_pwd', async ctx => {

    let params = ctx.request.body;
    if (!params) return baseController.response400(ctx);
    if (!params.token || !params.password || !params.mailCode) return baseController.response400(ctx);
    if (!baseController.REG.PASSWORD.test(params.password)) return baseController.response400(ctx, '密码不合法');

    let data = await asyncRedisClient.getAsync(redisKey.FORGET_MAIL_CODE(params.token));
    if (!data) return baseController.responseWithCode(ctx, baseController.CODE.EXPIRED_MAIL_CODE, "验证码已过期或未获取验证码");
    data = data.split('|');
    if (params.mailCode != data[0]) return baseController.responseWithCode(ctx, baseController.CODE.INVALID_MAIL_CODE, '验证码错误');

    let info = await userModel.selectByUsernameOrEmail(data[1]);
    await userModel.updatePasswordByUsername(data[1], util.md5(data[1] + params.password));
    await doLogin(ctx, info, false, util.uuid(), Date.now());

    baseController.response(ctx);

}).get('view/:urn', async ctx => { // 读取图片信息

    let params = ctx.params;
    if (!params.urn) return baseController.response400(ctx, '无效的请求链接');
    let urn = '/' + params.urn;

    let image = await imagesModel.selectByUrn(urn);
    if (!image) {
        return baseController.response400(ctx, '无效的请求链接');
    }

    ctx.set('Content-Type', 'image/' + image.url.split('.')[1]);
    ctx.body = fs.readFileSync(uploadConfig.path + image.url);

}).routes();


const doLogin = async (ctx, info, keepLogged, token, nowTime) => {

    let userInfo = {
        id: info._id,
        username: info.username
    };
    let userInfoJsonStr = JSON.stringify(userInfo);

    let authEx = baseController.CONSTS.SHORT_AUTH_COOKIE_EXPIRES_DAY * 24 * 60 * 60;

    // 登录成功
    let cookieOpt = {
        httpOnly: true,
        path: '/',
    };

    if (keepLogged) { // 长期登录

        authEx = baseController.CONSTS.AUTH_COOKIE_EXPIRES_DAY * 24 * 60 * 60;

        let tokens = await authTokenModel.selectByUserIdSortByCreateTimeAsc(userInfo.id);

        // 已经达到token上限 则移除最早的token信息
        if (tokens && tokens.length >= baseController.CONSTS.MAX_LIVING_TOKEN_NUMBER) {

            let deleteTokens = [];
            let deleteCount = tokens.length - baseController.CONSTS.MAX_LIVING_TOKEN_NUMBER;
            for (let index = 0; index <= deleteCount; index++) {
                deleteTokens.push(tokens[index].token);
                await asyncRedisClient.delAsync(redisKey.AUTH_TOKEN(tokens[index].token));
            }
            await authTokenModel.removeOwnByTokens(deleteTokens, userInfo.id);
        }

        await authTokenModel.save({
            userId: userInfo.id,
            token: token,
            expiration: nowTime + authEx * 1000,
            userInfo: userInfo
        });

        cookieOpt.maxAge = authEx * 1000;
    }

    // 写入redis验证数据
    await asyncRedisClient.setAsync(redisKey.AUTH_TOKEN(token), userInfoJsonStr, 'EX', parseInt(authEx));

    // 创建cookies会话凭证信息
    baseController.setCookie(ctx, cookiesName.COOKIE_NAME_TOKEN, token, cookieOpt);
    cookieOpt.httpOnly = false;
    baseController.setCookie(ctx, cookiesName.COOKIE_NAME_UINFO, encodeURI(userInfoJsonStr), cookieOpt);

};