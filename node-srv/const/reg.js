/**
 * @Author: acexy@thankjava.com
 * 2018/7/16
 * @Description:
 */
module.exports = {
    // 判断邮箱的正则
    IS_MAIL: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{1,4}){1,2})$/,
    // 用户账号校验正则
    USERNAME: /^[a-zA-Z0-9_-]{4,16}$/,
    PASSWORD: /^[a-zA-Z0-9_-]{6,20}$/,
    // token 脱敏
    TOKEN_ENCODE: /^(\w{3})\w*(\w{4})$/,
    // token 脱敏
    USERNAME_ENCODE: /^(\w{2})\w*(\w{1})$/,
    // 邮箱脱敏
    MAIL_ENCODE: /(.{2}).+(.{2}@.+)/,
};