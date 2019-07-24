/**
 * @Author:acexy@thankjava.com
 * 2018/6/13
 * @Description:登录相关处理
 */

const Router = require('koa-router');

const baseController = require('./baseController');
const imagesModel = require('../models/images');
const shareImgModel = require('../models/shareImg');

const path = require('path');

const fs = require('fs');
const uploadConfig = require('../config/upload');

module.exports = new Router(
).get(':urn', async ctx => { // 图片源地址访问图片 读取图片信息

    let params = ctx.params;
    if (!params.urn) {
        await readInvalidFile(ctx);
        return;
    }
    let urn = '/' + params.urn;
    let image = await imagesModel.selectByUrn(urn);
    await readFile(image, ctx);
}).get('share/:urn', async ctx => {
    let params = ctx.params;
    console.log(params);
    if (!params.urn) {
        await readInvalidFile(ctx);
        return;
    }

    let shareImg = await shareImgModel.selectOneByUrn(params.urn);
    if (!shareImg) {
        await readInvalidFile(ctx);
        return;
    }

    if (!shareImg.status) {
        await readShareInvalidFile(ctx);
        return
    }

    let image = await imagesModel.selectById(shareImg.imgId);
    await readFile(image, ctx);

}).routes();

const readFile = async (image, ctx) => {
    if (!image) {
        await readInvalidFile(ctx);
        return
    }
    ctx.set('Content-Type', 'image/' + image.url.split('.')[1]);
    ctx.set('Cache-Control', 'public, max-age=28800');
    ctx.body = fs.readFileSync(uploadConfig.path + image.url);
};

// 读取图片链接失效的默认图片
const readInvalidFile = async ctx => {
    let picPath = path.join(__dirname, '..', 'resource', 'invalid.png');
    ctx.set('Content-Type', 'image/png');
    ctx.body = fs.readFileSync(picPath);
};

const readShareInvalidFile = async ctx => {
    let picPath = path.join(__dirname, '..', 'resource', 'shareInvalid.png');
    ctx.set('Content-Type', 'image/png');
    ctx.body = fs.readFileSync(picPath);
};