/**
 * @Author: acexy@thankjava.com
 * @Date: 2019-04-25
 * @Description: 处理sort分类的mongo数据层
 **/
const baseModel = require('./basic.js');

class defaultLoadSortId extends baseModel {

    Schema() {
        return {
            userId: {type: String, required: true},
            sortId: {type: String},
        };
    };

    SchemaName() {
        return 'default_load_sort';
    };

    save(userId, sortId) {
        return new this.model({userId: userId, sortId: sortId}).save();
    }

    updateOwnById(sortId, userId) {
        return this.model.updateOne({sortId: sortId}, {userId: userId}).exec();
    }

    removeOwnById(userId) {
        return this.model.deleteOne({userId: userId}).exec();
    }

    selectOneByOwnId(userId) {
        return this.model.findOne({userId: userId}).exec();
    }

}

module.exports = new defaultLoadSortId();