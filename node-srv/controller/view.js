/**
 * @Author:acexy@thankjava.com
 * 2018/6/13
 * @Description:登录相关处理
 */

const Router = require('koa-router');

const baseController = require('./baseController');
const imagesModel = require('../models/images');

const fs = require('fs');
const uploadConfig = require('../config/upload');

module.exports = new Router(
).get(':urn', async ctx => { // 图片源地址访问图片 读取图片信息

    let params = ctx.params;
    if (!params.urn) return baseController.response400(ctx, '无效的请求链接');
    let urn = '/' + params.urn;

    let image = await imagesModel.selectByUrn(urn);
    if (!image) {
        return baseController.response400(ctx, '无效的请求链接');
    }

    ctx.set('Content-Type', 'image/' + image.url.split('.')[1]);
    ctx.set('Cache-Control', 'public, max-age=28800');

    ctx.body = fs.readFileSync(uploadConfig.path + image.url);

}).get('share/:urn', async ctx => {

}).routes();