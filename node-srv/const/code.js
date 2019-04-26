/**
 * @Author:acexy@thankjava.com
 * 2018/6/13
 * @Description:
 */
module.exports = {


    INVALID_ACCOUNT: "1000",            // 不存在的用户账号
    PASSWORD_ERROR: "1001",             // 密码错误
    // THE_SAME_PASSWORD: "1002",          // 修改的密码和原密码相同
    // INVALID_NEW_PASSWORD: "1003",       // 密码长度过低/过高
    EXISTING_MAIL: "1004",              // 存在的邮箱地址
    EXISTING_USERNAME: "1005",          // 存在的用户名
    SEND_MAIL_FAILED: "1006",           // 邮件发送失败
    EXPIRED_MAIL_CODE: "1007",          // 验证码过期
    INVALID_MAIL_CODE: "1008",          // 验证码错误
    ERROR_REGISTE_DATA: "1009",         // 邮箱验证数据异常
    ERROR_ACCOUNT_OR_EMAIL: "1010",     // 无效的邮箱或者帐号

    UNKNOWN_SORT_ID: "1011",            // 不存在的分类ID
    BAD_OBJECT_ID: "1012",               // 无效的object_id
    UNKNOWN_IMG_ID: "1013",               // 无效的图片id
    MAX_IMG_TAG: "1014",                // 标签超出上限
    EXISTS_IMG_TAG: "1015",             // 已存在的标签
};