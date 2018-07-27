/**
 * @Author:acexy@thankjava.com
 * 2018/6/12
 * @Description:基础路由扫描器
 */
const Router = require('koa-router');
const path = require('path');
const fs = require('fs');

// 自动扫描业务的路由定制
const scanRouters = () => {

    let router = new Router();
    let routersDirPath = __dirname;
    let routers = findFiles(routersDirPath);

    if (routers.length > 0) {
        console.log('=> koa: '.cyan + 'load routers:'.grey);
        routers.forEach((routerFilePath) => {
            console.log('   > '.black + path.relative(routersDirPath, routerFilePath).blue);
            router.use(require(routerFilePath));
        });
    }

    return router;
};

const findFiles = (dirpath) => {
    let filesPath = [];

    // 提供了子目录扫描
    // function doFind(_path) {
    //     let files = fs.readdirSync(_path);
    //     files.forEach((val, index) => {
    //         let fPath = path.join(_path, val);
    //         let stats = fs.statSync(fPath);
    //         if (stats.isDirectory()) doFind(fPath);
    //         if (stats.isFile()) filesPath.push(fPath);
    //     });
    //
    // }

    function doFind(_path) {
        let files = fs.readdirSync(_path);
        files.forEach((val, index) => {
            let fPath = path.join(_path, val);
            let stats = fs.statSync(fPath);
            if (stats.isFile() && fPath != __filename) filesPath.push(fPath);
        });
    }

    doFind(dirpath);
    return filesPath;
};

module.exports = scanRouters();