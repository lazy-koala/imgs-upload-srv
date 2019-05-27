/**
 * @Author:acexy@thankjava.com
 * 2018/6/14
 * @Description:图片相关处理
 */
const Router = require('koa-router');
const uploadConfig = require('../config/upload');
const baseConfig = require('../config/basic');

const busboyUpload = require('../lib/busboyUpload');
const baseController = require('./baseController');
const imagesModel = require('../models/images');
const sortModel = require('../models/sort');
const asyncRedisClient = require('../lib/asyncRedis').client;
const redisKey = require('../const/redisKey');

const algorithm10to64 = require('../lib/algorithm10to64');
const util = require('../lib/util');

let defaultSortId;

module.exports = new Router(

).post('upload', async (ctx) => {

    let uploadResult = await busboyUpload.upload(ctx);
    console.log(JSON.stringify(uploadResult));
    if (!uploadResult.flag) return baseController.response500(ctx, '图片上传异常');
    uploadResult = uploadResult.uploadResult;
    let fields = uploadResult.fields;
    let sortId;
    if (!fields || !fields.sortId) {
        if (!defaultSortId) {
            defaultSortId = await sortModel.selectUserId('system')._id;
        }
        sortId = defaultSortId;
    } else {
        sortId = fields.sortId;
    }
    let saveImages = [];
    let userId = ctx.state.authInfo.id;

    let incr;


    // TODO : 此处图片上传设计为多张, 但是标签和分类只设计传一张, 所以上传暂时约定一张一张上传
    for (let index in uploadResult) {

        incr = await asyncRedisClient.incrAsync(redisKey.IMG_INCR_NO());

        if (uploadResult[index].flag) {
            let img = {
                userId: userId,
                url: uploadResult[index].path,
                urn: '/' + algorithm10to64.number10to64(incr + new Date().getTime()),
                sortId: sortId
            };
            if (fields && fields.tags && fields.tags.length > 0) {
                img.tags = fields.tags;
            }
            saveImages.push(img);

            uploadResult[index].path = baseConfig.imgUri + uploadResult[index].urn;
        }
    }

    if (saveImages.length > 0) {
        imagesModel.saveMany(saveImages);
    }

    baseController.response(ctx, uploadResult);

}).get('list', async ctx => {

    let page = ctx.query;
    if (!page) return baseController.response400(ctx, '请求参数缺失');
    let pageSize = page.pageSize;
    let pageNumber = page.pageNumber;
    if (!pageNumber) return baseController.response400(ctx, '缺失参数: pageNumber');
    if (pageSize < 1 || pageNumber < 1) return baseController.response400(ctx, '请求参数不合法');

    page.pageSize = Number(pageSize);
    page.pageNumber = Number(pageNumber);
    page.query = {
        userId: ctx.state.authInfo.id
    };

    if (page.sortId) {
        page.query.sortId = page.sortId
    }

    if (page.tag && page.tag.length > 0) {
        let likeConditionArray = [];
        for (let i = 0; i < page.tag.length; i++) {
            likeConditionArray.push({'tags': {'$regex': page.tag[i]}});
        }
        page.query["$or"] = likeConditionArray;
    }

    let response = await imagesModel.selectByPage(page);
    if (!response) return baseController.response500(ctx);
    if (response.list) {
        let list = response.list;
        for (let index = 0; index < list.length; index++) {
            list[index]._doc.suffix = list[index].url.split('.')[1];
            list[index].url = baseConfig.imgUri + list[index].urn; // 拼装图片服务器主域名
        }
    }
    baseController.response(ctx, response);

}).post('del', async (ctx) => {

    let params = ctx.request.body;
    if (!params) return baseController.response400(ctx, '请求参数缺失');
    if (!params.ids || params.ids.length == 0) return baseController.response400(ctx, '请求参数异常');
    let ids = params.ids;
    let imgs = await imagesModel.selectOwnByIds(ids, ctx.state.authInfo.id); // 防止删除别人的数据
    if (!imgs) return baseController.response(ctx);
    let uriArray = [];
    for (var i in imgs) {
        uriArray.push(uploadConfig.path + imgs[i].url); // 得到有效的需要删除的 物理路径图片位置
    }
    util.fsDel(uriArray); // 异步移除图片
    await imagesModel.removeOwnManyById(ids, ctx.state.authInfo.id); // 清除数据库记录
    baseController.response(ctx);

}).routes();