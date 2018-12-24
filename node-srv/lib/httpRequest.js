/**
 * @Author:acexy@thankjava.com
 * 2017/12/25
 * @Description:
 */
const request = require('request');

module.exports.doRequestBuffer = requestParam => new Promise(resolve => {
    let bufs = [];
    let data = {flag: false};

    request(requestParam, (err, response, body) => {
        if (err) {
            resolve(data);
        } else {
            data.flag = true;
        }
    }).on('data', buf => {
        bufs.push(buf);
    }).on('end', () => {
        data.buffer = Buffer.concat(bufs);
        resolve(data);
    });
});