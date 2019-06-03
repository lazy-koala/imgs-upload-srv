/**
 * @Author: acexy@thankjava.com
 * 2018/6/15
 * @Description:
 */
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongodb = require('../lib/mongodb');

class baseModel {

    constructor() {

        this.schema = new schema(addDefaultField(this.Schema()), {versionKey: false});
        this.name = this.SchemaName();
        this.model = mongodb.loadModel(this.name, this.schema);

        // 添加默认字段
        function addDefaultField(customizeSchema) {

            customizeSchema.createTime = {type: Number, default: Date.now};

            return customizeSchema;
        }
    }


    Schema() {
    };

    SchemaName() {
    };
}

module.exports = baseModel;

/**
 * 提供统一分页查询
 * @param page    {pageSize:,pageNumber,query:{},sort:{}} query: 查询条件 sort: 排序方式 {field:-1/1} 同mongo标准
 * @param model
 * @returns {Promise<any>}
 */
module.exports.selectByPage = (page, model) => new Promise(resolve => {

    let query = {};

    let sort = {createTime: -1}; // 默认排序规则 按时间降序
    if (page.query) {
        query = page.query;
    }

    if (page.sorts) {
        sort = page.sorts;
    }

    let fields = null;
    if (page.fields) {
        fields = page.fields;
    }

    model.countDocuments(query, (err, count) => {
        if (err) {
            console.error(err);
            resolve(null);
        } else {
            page.pageNumber = page.pageNumber || 1;
            page.pageSize = page.pageSize || 10;
            let response = {
                pageSize: page.pageSize,
                pageNumber: page.pageNumber,
                pageCount: Math.ceil(count / page.pageSize),
                totalCount: count,
                hasNext: false
            };
            if (count == 0) {
                resolve(response);
            } else {
                model.find(query, fields, {sort: sort}).skip(page.pageSize * (page.pageNumber - 1)).limit(page.pageSize).exec((err, docs) => {
                    if (err) {
                        console.error(err);
                        resolve(null);
                    } else {
                        response.list = docs;
                        response.hasNext = count > page.pageSize * page.pageNumber;
                        resolve(response);
                    }
                });
            }
        }
    });
});
//
module.exports.typeMixed = schema.Types.Mixed;
module.exports.typeObject = mongoose.Types.ObjectId;
module.exports.typeDecimal128 = schema.Types.Decimal128;
