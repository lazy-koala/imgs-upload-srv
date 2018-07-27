/**
 * @Author:acexy@thankjava.com
 * 2018/6/14
 * @Description: 图片相关路由器
 */

const Router = require('koa-router');

const router = new Router({
    prefix: '/imgs/'
});

router.use(require('../controller/imgs'));

module.exports = router.routes();