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
        return this.model.insertMany(shareImgs);
    }

    selectManyByCondition(condition) {
        return this.model.find(condition).exec();
    }

    selectOneByUrn(urn) {
        return this.model.findOne(urn).exec();
    }

    updateManyByShareId(shareId, condition) {
        return this.model.updateMany({shareId: shareId}, condition).exec();
    }
}

module.exports = new shareImg();