/**
 * @Author: acexy@thankjava.com
 * 2018/7/9
 * @Description:处理用户相关模块
 */
const Router = require('koa-router');

const router = new Router({
    prefix: '/user/'
});

router.use(require('../controller/user'));

module.exports = router.routes();