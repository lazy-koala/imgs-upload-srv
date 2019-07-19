/**
 * @Author: acexy@thankjava.com
 * 2018/6/15
 * @Description:分享图片
 */

const baseModel = require('./basic.js');

class shareImg extends baseModel {

    Schema() {
        return {
            imgId: {type: String, required: true},
            shareId: {type: String, required: true},
            urn: {type: String, required: true, unique: true},
        };
    };

    SchemaName() {
        return 'share_images';
    };

    save(shareImg) {
        return new this.model(shareImg).save();
    }

}

module.exports = new shareImg();