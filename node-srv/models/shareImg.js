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
            status: {type: Boolean, required: true, default: true}
        };
    };

    SchemaName() {
        return 'share_images';
    };

    save(shareImg) {
        return new this.model(shareImg).save();
    }

    saveMany(shareImgs) {
        return new this.model.insertMany(shareImgs);
    }
}

module.exports = new shareImg();