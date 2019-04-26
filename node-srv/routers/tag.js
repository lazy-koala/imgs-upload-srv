/**
 * @Author: acexy@thankjava.com
 * 2019/4/22
 * @Description:
 */

const Router = require('koa-router');

const router = new Router({
    prefix: '/tag/'
});

router.use(require('../controller/tag'));

module.exports = router.routes();