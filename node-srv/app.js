/**
 * @Author:acexy@thankjava.com
 * 2018/6/11
 * @Description: app.js
 */
require('./extends');

const basicConfig = require('./config/basic');
const mongodb = require('./lib/mongodb');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const routerScanner = require('./routers/routerScanner');

mongodb.open(function () {

    const app = new Koa();

    app.proxy = true;

    app.use(bodyParser({
        enableTypes: ['json','form']
    }));

    app.use(require('./middleware/basic'));
    app.use(require('./middleware/auth'));

    app.use(routerScanner.routes());
    app.use(routerScanner.allowedMethods());

    app.listen(basicConfig.port, () => {
        console.log('=> koa: '.cyan + 'listened port = '.grey + String(basicConfig.port).blue);
    });
});