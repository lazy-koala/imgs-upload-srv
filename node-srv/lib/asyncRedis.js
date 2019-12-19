/**
 * @Author:acexy@thankjava.com
 * 2018/6/1
 * @Description:redis
 */
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(require('../config/redis.json'));

console.log('=> redis: '.magenta + 'connecting'.grey);
module.exports.client = client;
module.exports.closeClient = () => client.quit();

client.on('error', (err) => {
    console.log('=> redis: '.magenta + 'error'.red);
    console.error(err);
});