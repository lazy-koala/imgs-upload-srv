/**
 * @Author: acexy@thankjava.com
 * 2018/7/9
 * @Description:
 */
const Router = require('koa-router');
const baseController = require('./baseController');
const userModel = require('../models/user');
const util = require('../lib/util');
const mailSender = require('../lib/mailSender');
const mailType = require('../const/mailType');
const asyncRedisClient = require('../lib/asyncRedis').client;
const redisKey = require('../const/redisKey');
const busboyUpload = require('../lib/busboyUpload');
const uploadConfig = require('../config/upload');
const baseConfig = require('../config/basic');


module.exports = new Router(

).post('/change_pwd', async ctx => {

    let params = ctx.request.body;
    if (!params) return baseController.response400(ctx);
    if (!params.oldPassword || !params.newPassword || !params.verifyPassword) return baseController.response400(ctx);
    if (!baseController.REG.PASSWORD.test(params.password)) return baseController.response400(ctx, '密码不合法');
    if (params.newPassword != params.verifyPassword) return baseController.response400(ctx, '两次密码不一致');
    if (params.oldPassword == params.newPassword) return baseController.response400(ctx, '原密码和新密码相同');
    let authInfo = ctx.state.authInfo;
    let user = await userModel.selectById(authInfo.id);
    if (user.password != util.md5(user.username + params.newPassword)) return baseController.responseWithCode(ctx, baseController.CODE.PASSWORD_ERROR, '原密码错误');
    await userModel.updatePasswordByUsername(user.username, util.md5(user.username + params.newPassword));
    baseController.response(ctx);

}).post('send_upload_mail_code', async ctx => {

    let params = ctx.request.body;
    if (!params || !params.mail) return baseController.response400(ctx);
    let user = await userModel.selectByUsernameOrEmail(params.mail);
    if (user) return baseController.responseWithCode(ctx, baseController.CODE.EXISTING_MAIL, '该邮箱地址已存在');

    user = await userModel.selectById(ctx.state.authInfo.id);
    let code = util.randomNum(6);
    let data = [
        user.nickname,
        user.email.replace(baseController.REG.MAIL_ENCODE, '$1****$2'),
        code
    ];

    let token = util.uuid();

    let flag = await mailSender.send(mailType.type.UPDATE_MAIL_CODE, params.mail, data);
    if (flag) {
        await asyncRedisClient.setAsync(redisKey.UPDATE_MAIL_CODE(token), code + '|' + params.mail, 'EX', baseController.CONSTS.UPDATE_MAIL_MINUTE * 60);
        baseController.response(ctx, {token: token});
    } else {
        baseController.response(ctx, baseController.CODE.SEND_MAIL_FAILED, '邮件发送失败，请检查你的邮箱或重试');
    }

}).post('update_uinfo', async ctx => {

    let params = ctx.request.body;
    if (!params) return baseController.response400(ctx);
    if ((params.token && !params.mail) || (params.mail && !params.token)) return baseController.response400(ctx);

    let uploadResult = await busboyUpload.upload(ctx);
    if (!uploadResult.flag) return baseController.response500(ctx, '图片上传异常');

    uploadResult = uploadResult.uploadResult;
    let update = {};
    let headImg = null;
    if (uploadResult) {
        let result = uploadResult[0];
        if (!result.flag) return baseController.response500(ctx, '图片上传异常');
        headImg = result.path;
        update.headImg = headImg;
    }

    let user = await userModel.selectById(ctx.state.authInfo.id);
    if (headImg && user.headImg) {
        util.fsDel(uploadConfig.path + user.headImg);
    }

    if (params.nickname) {
        update.nickname = params.nickname;
    }

    await userModel.updateByUsername(update, user.username);
    baseController.response(ctx);

}).get('uinfo', async ctx => {
    let user = await userModel.selectById(ctx.state.authInfo.id);
    baseController.response(ctx, {
        id: user._id,
        username: user.username,
        nickname: user.nickname,
        email: user.email.replace(baseController.REG.MAIL_ENCODE, '$1****$2'),
        headImg: user.headImg ? baseConfig.imgsDomain + user.headImg : null
    });
}).routes();