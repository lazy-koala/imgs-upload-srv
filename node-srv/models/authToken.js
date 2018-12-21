/**
 * @Author: acexy@thankjava.com
 * 2018/6/19
 * @Description:
 */
const baseModel = require('./basic.js');

class authToken extends baseModel {
    Schema() {
        return {
            userId: {type: String, required: true},
            token: {type: String, required: true, unique: true},
            expiration: {type: Number, required: true},
            remark: {type: String, required: false},
        };
    };

    SchemaName() {
        return 'auth_token';
    };

    // 存储
    save(authToken) {
        return new this.model(authToken).save();
    }

    removeOwnByIds(ids, userId) {
        let condition = {userId: userId};
        if (typeof ids === 'string') {
            condition._id = ids;
        } else if (Array.isArray(ids)) {
            condition._id = {
                '$in': ids
            };
        } else {
            return false;
        }
        return this.model.remove(condition).exec();
    }

    removeOwnByTokens(tokens, userId) {
        let condition = {userId: userId};
        if (typeof tokens === 'string') {
            condition.token = tokens;
        } else if (Array.isArray(tokens)) {
            condition.token = {
                '$in': tokens
            };
        } else {
            return false;
        }
        return this.model.remove(condition).exec();
    }

    selectByUserIdSortByCreateTimeDesc(userId) {
        return this.model.find({userId: userId}).sort({createTime: -1}).exec();
    }

    selectByUserIdSortByCreateTimeAsc(userId) {
        return this.model.find({userId: userId}).sort({createTime: 1}).exec();
    }

    selectOwnByIds(ids, userId) {
        let condition = {userId: userId};
        if (typeof ids === 'string') {
            condition._id = ids;
        } else if (Array.isArray(ids)) {
            condition._id = {
                '$in': ids
            };
        } else {
            return false;
        }
        return this.model.find(condition).exec();
    }
}

module.exports = new authToken();