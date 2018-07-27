/**
 * @Author:acexy@thankjava.com
 * 2018/6/13
 * @Description: 普通路由匹配 /*
 */

const Router = require('koa-router');

const router = new Router({
    prefix: '/'
});

router.use(require('../controller/common'));

module.exports = router.routes();