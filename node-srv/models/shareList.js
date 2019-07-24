/**
 * @Author: acexy@thankjava.com
 * 2018/6/15
 * @Description:分享清单
 */

const baseModel = require('./basic.js');

class shareList extends baseModel {

    Schema() {
        return {
            userId: {type: String, required: true},
            type: {type: String, required: true},
            status: {type: Boolean, required: true, default: true},
            sortId: {type: String, required: true}
        };
    };

    SchemaName() {
        return 'share_list';
    };

    save(shareList) {
        return new this.model(shareList).save();
    }

    selectOneById(shareId) {
        return this.model.findOne({_id: shareId}).exec();
    }

    selectOneOfOwnById(shareId, userId) {
        return this.model.findOne({_id: shareId, userId: userId}).exec();
    }

    updateById(condition, shareId) {
        return this.model.updateOne({_id: shareId}, condition).exec();
    }
}

module.exports = new shareList();