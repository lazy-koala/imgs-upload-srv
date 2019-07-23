/**
 * @Author: acexy@thankjava.com
 * 2019/4/22
 * @Description:
 */

const Router = require('koa-router');

const router = new Router({
    prefix: '/share/'
});

router.use(require('../controller/share'));

module.exports = router.routes();