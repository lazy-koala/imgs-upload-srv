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
const asyncRedisClient = require('../lib/asyncRedis').client;
const redisKey = require('../const/redisKey');

const algorithm10to64 = require('../lib/algorithm10to64');
const util = require('../lib/util');


module.exports = new Router(

).post('upload', async (ctx) => {

    let uploadResult = await busboyUpload.upload(ctx);
    if (!uploadResult.flag) return baseController.response500(ctx, '图片上传异常');
    uploadResult = uploadResult.uploadResult;
    let saveImages = [];
    let userId = ctx.state.authInfo.id;

    let incr;

    for (let index in uploadResult) {

        incr = await asyncRedisClient.incrAsync(redisKey.IMG_INCR_NO());

        if (uploadResult[index].flag) {

            saveImages.push({
                userId: userId,
                url: uploadResult[index].path,
                urn: '/' + algorithm10to64.number10to64(incr)
            });

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
    if (!pageSize || !pageNumber) return baseController.response400(ctx, '请求参数缺失');
    if (pageSize < 1 || pageNumber < 1) return baseController.response400(ctx, '请求参数不合法');

    page.pageSize = Number(pageSize);
    page.pageNumber = Number(pageNumber);
    page.query = {
        userId: ctx.state.authInfo.id
    };

    let response = await imagesModel.selectByPage(page);
    if (!response) return baseController.response500(ctx);
    if (response.list) {
        let list = response.list;
        for (let index = 0; index < list.length; index++) {
            list[index].url = baseConfig.imgUri + list[index].urn; // 拼装图片服务器主域名
            list[index].suffix = list[index].url.split('.')[1];
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