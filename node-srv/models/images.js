/**
 * @Author: acexy@thankjava.com
 * 2018/6/19
 * @Description:图片模块数据库
 */
const baseModel = require('./basic.js');

class images extends baseModel {

    Schema() {
        return {
            userId: {type: String, required: true},
            url: {type: String, required: true},
            remark: {type: String, required: false},
            urn: {type: String, unique: true},
            sortId: {type: String, required: true},
            tags: {type: Array, required: false}
        };
    };

    SchemaName() {
        return 'images';
    };

    save(images) {
        return new this.model(images).save();
    }

    saveMany(imagesArray) {
        return this.model.insertMany(imagesArray);
    }

    selectByPage(page) {
        return baseModel.selectByPage(page, this.model);
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

    removeOwnManyById(ids, userId) {
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

    selectByUrn(urn) {
        return this.model.findOne({urn: urn}).exec();
    }

}

module.exports = new images();