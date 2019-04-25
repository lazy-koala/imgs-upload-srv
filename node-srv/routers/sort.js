/**
 * @Author: acexy@thankjava.com
 * 2019/4/22
 * @Description:
 */

const Router = require('koa-router');

const router = new Router({
    prefix: '/sort/'
});

router.use(require('../controller/sort'));

module.exports = router.routes();