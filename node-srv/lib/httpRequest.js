/**
 * @Author:acexy@thankjava.com
 * 2017/12/25
 * @Description:
 */
const request = require('request');

module.exports.doRequest = requestParam => new Promise(resolve => {
    request(requestParam, (err, response, body) => {
        let data = {flag: false};
        if (err) {
            resolve(data);
        } else {
            data.flag = true;
            data.body = body;
            resolve(data);
        }
    });
});