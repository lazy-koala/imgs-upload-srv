/**
 * @Author: acexy@thankjava.com
 * 2018/7/16
 * @Description:
 */
module.exports.config = {
    // 注册邮件验证码
    REGISTE_CODE: {
        title: "图床服务：注册",
        templateName: "RegisteCode.html"
    },
    FORGET_CODE: {
        title: "图床服务：找回密码",
        templateName: "ForgetCode.html"
    },
    UPDATE_MAIL_CODE: {
        title: '图床服务：修改邮箱',
        templateName: "UpdateMailCode.html"
    }
};


module.exports.type = {
    REGISTE_CODE: 'REGISTE_CODE',
    FORGET_CODE: 'FORGET_CODE',
    UPDATE_MAIL_CODE: 'UPDATE_MAIL_CODE'
};