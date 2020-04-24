const path = require('path')

module.exports = {
    lintOnSave: false,
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
         // 修复HMR
        config.resolve.symlinks(true);
    },
    outputDir: 'dist', //build输出目录
    assetsDir: 'assets', //静态资源目录（js, css, img）
    lintOnSave: false, //是否开启eslint
    devServer: {
        open: true, //是否自动弹出浏览器页面
        host: "localhost",
        port: '8080',
        proxy: {
            // testimg测试环境
            '/api': { //代理地址
                target: 'https://testimgs.thankjava.com', //需要代理的地址
                changeOrigin: true, //是否跨域
                secure: false,
                baseURL: 'https://testimgs.thankjava.com'
            }

            // 线上环境
            // '/api': { //代理地址
            //     target: 'https://imgs.thankjava.com', //需要代理的地址
            //     changeOrigin: true, //是否跨域
            //     secure: false,
            //     baseURL: 'https://imgs.thankjava.com'
            // }
        },
    },
    // configureWebpack: config => {
    //     if (debug) { // 开发环境配置
    //       config.devtool = 'source-map'
    //     }
    // }
}

function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './src/themes/index.scss'),
            ],
        })
}