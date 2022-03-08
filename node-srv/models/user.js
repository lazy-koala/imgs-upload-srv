/**
 * @Author: acexy@thankjava.com
 * 2018/6/15
 * @Description:用户模块数据库
 */

const baseModel = require('./basic.js');

class user extends baseModel {

    Schema() {
        return {
            username: {type: String, required: true, unique: true},
            password: {type: String, required: true},
            email: {type: String, required: true, unique: true},
            nickname: {type: String, required: true},
            headImg: {type: String, required: false},
            lastLoginTime: {type: Number, default: Date.now}
        };
    };

    SchemaName() {
        return 'user';
    };

    save(user) {
        return new this.model(user).save();
    }

    /**
     * 通过邮件或者帐号查询用户
     * @param loginId
     * @returns {Promise}
     */
    selectByUsernameOrEmail(loginId) {
        let query = {};
        if (loginId.indexOf('@') != -1) {
            query.email = loginId;
        } else {
            query.username = loginId;
        }
        return this.model.findOne(query).exec();
    }

    /**
     * 条件查询用户信息
     * @param condition
     * @returns {Promise}
     */
    selectByConditionOnlyOne(condition) {
        return this.model.findOne(condition).exec();
    }

    /**
     * 通过帐号更新密码
     * @param username
     * @param password
     * @returns {Promise}
     */
    updatePasswordByUsername(username, password) {
        return this.model.updateOne({username: username}, {password: password}).exec();
    }

    selectById(id) {
        return this.model.findOne({_id: baseModel.typeObject(id)}).exec();
    }

    updateByUsername(condition, username) {
        return this.model.updateOne({username: username}, condition).exec();
    }

    updateLastLoginTimeByUsername(username) {
        return this.model.updateOne({lastLoginTime: Date.now}, {username: username});
    }
}

module.exports = new user();