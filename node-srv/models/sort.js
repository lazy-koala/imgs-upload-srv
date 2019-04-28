/**
 * @Author: acexy@thankjava.com
 * @Date: 2019-04-25
 * @Description: 处理sort分类的mongo数据层
 **/
const baseModel = require('./basic.js');

class sort extends baseModel {

    Schema() {
        return {
            sortName: {type: String, required: true},
            userId: {type: String, required: true},
        };
    };

    SchemaName() {
        return 'sorts';
    };

    save(sort) {
        return new this.model(sort).save();
    }

    selectById(id) {
        return this.model.findOne({_id: id}).exec();
    }

    updateById(condition, sortId) {
        return this.model.updateOne({_id: sortId}, condition).exec();
    }

    removeById(sortId) {
        return this.model.remove({_id: sortId}).exec();
    }

    selectUserId(userId) {
        return this.model.findOne({userId: userId}).exec();
    }
}

module.exports = new sort();