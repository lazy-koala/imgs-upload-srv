/**
 * @Author:acexy@thankjava.com
 * 2018/5/28
 * @Description:utils
 */
const md5 = require('md5');
const fs = require('fs');

const uuid = require('uuid');
const UA = require('ua-device');
const sharp = require('sharp');
const path = require('path');

const httpRequest = require('./httpRequest');
const imagesModel = require('../models/images');
const basicConfig = require('../config/basic');

/**
 * md5
 * @param content
 * @returns {*}
 */
module.exports.md5 = content => md5(content);
/**
 * uuid生成器
 * @returns {string}
 */
module.exports.uuid = () => String(uuid.v4()).replace(/-/g, '');

/**
 * 文件删除
 */
module.exports.fsDel = uris => {
    for (let i in uris) {
        fs.rename(uris[i], uris[i] + '.del', err => {
            if (err) {
            }
        });
    }
};

module.exports.fsDelReal = uris => {
    for (let i in uris) {
        fs.unlink(uris[i], err => {
            if (err) {
            }
        });
    }
};

/**
 * 生成指定范围随机数
 * @param min
 * @param max
 * @returns {number}
 */
const randomMin2Max = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports.randomMin2Max = randomMin2Max;

/**
 * 生成指定长度的随机数 0-9
 * @param length
 * @returns {string}
 */
module.exports.randomNum = length => {
    let code = '';
    for (let index = 0; index < length; index++) {
        code += randomMin2Max(0, 9);
    }
    return code;
};

/**
 * 格式化 User-Agent
 * @param uaString
 * @returns {null|{browserVersion: *, browserName: *, osName: *}}
 */
module.exports.ua = uaString => {
    if (!uaString) return null;
    let ua = new UA(uaString);
    if (ua) {
        return {
            osName: ua.os.name,
            browserName: ua.browser.name,
            browserVersion: ua.browser.version.original
        }
    }
    return null;
};

module.exports.createThumb = async (absPath) => {
    let dirPath = path.join(absPath, '..');
    let fileName = absPath.replace(dirPath + '/', '');
    await sharp(fs.readFileSync(absPath))
        .resize({width: 160})
        .toFile(dirPath + '/thumb-' + fileName);
    return '/thumb/' + md5(fileName);
};

module.exports.imageCheck = (imgUri, urn) => {

    httpRequest.doRequestString(basicConfig.imageVerify + imgUri).then(res => {
        if (res.flag) {

            let obj = JSON.parse(res.body);

            let update = {
                sysScyLevel: obj.rating_index,
                sysScyLevelTime: Date.now(),
                sysScyLevelDetail: JSON.stringify(obj.predictions)
            };

            if (obj.rating_index === 3) {
                update.status = '01';
            }

            imagesModel.updateByCondition(update, {urn: urn});
            console.log('图片自动分级完成 urn =', urn);

        } else {
            console.error('图片自动分级异常 urn =', urn, res.error);
        }
    });

};

module.exports.changeToWebp = absPath => {

    let dirPath = path.join(absPath, '..');
    let fileName = absPath.replace(dirPath + '/', '');
    fileName = fileName.split('.')[0] + '.webp';

    sharp(fs.readFileSync(absPath))
        .webp({lossless: false})
        .toFile(path.join(dirPath, fileName), (err, info) => {
            console.log(info)
        });
};