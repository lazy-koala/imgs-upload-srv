/**
 * @Author:acexy@thankjava.com
 * 2018/6/1
 * @Description: redisKey管理
 */
const util = require('util');

module.exports.AUTH_TOKEN = function (token) { // string
    return util.format('imgs-upload-srv:auth_token:%s', token);
}; // 用户token信息鉴权缓存

module.exports.REG_MAIL_CODE = token => {
    return util.format('imgs-upload-srv:reg_mail_code:%s', token);
};// 用户注册邮件验证码

module.exports.FORGET_MAIL_CODE = token => {
    return util.format('imgs-upload-srv:forget_mail_code:%s', token);
};// 找回密码邮件验证码

module.exports.UPDATE_MAIL_CODE = token => {
    return util.format('imgs-upload-srv:update_mail_code:%s', token);
};// 修改邮箱验证码

// 图片编号
module.exports.IMG_INCR_NO = _ => "imgs-upload-srv:img_incr_no";