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
        };
    };

    SchemaName() {
        return 'share_list';
    };

    save(shareList) {
        return new this.model(shareList).save();
    }

}

module.exports = new shareList();