/**
 * @Author: acexy@thankjava.com
 * 2018/7/26
 * @Description:
 */

const Router = require('koa-router');

const router = new Router({
    prefix: '/token/'
});

router.use(require('../controller/token'));

module.exports = router.routes();