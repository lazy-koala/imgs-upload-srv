/**
 * @Author: acexy@thankjava.com
 * 2019/4/22
 * @Description:
 */

const Router = require('koa-router');

const router = new Router({
    prefix: '/view/'
});

router.use(require('../controller/view'));

module.exports = router.routes();