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
                console.error(err)
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
    return '/thumb/' + util.md5(fileName);
};