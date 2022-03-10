const path = require('path')
function resolve (dir) {
  return path.join(__dirname, './', dir)
}
// vue.config.js
module.exports = {
  devServer: {
    // Paths
    proxy: {
      // '/api': {  //代理地址
      //     changeOrigin: true,  //是否跨域
      //     secure: false,
      //     pathRewrite: {
      //         '^/api': '/mock/27/api'   //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
      //     }
      // }
      // testimg测试环境
      // '/api': { //代理地址
      //     target: 'https://testimgs.acexy.cn', //需要代理的地址
      //     changeOrigin: true, //是否跨域
      //     secure: false,
      //     baseURL: 'https://testimgs.acexy.cn'
      // }

      // 线上环境
      // '/api': { //代理地址
      //     target: 'https://imgs.acexy.cn', //需要代理的地址
      //     changeOrigin: true, //是否跨域
      //     secure: false,
      //     baseURL: 'https://imgs.acexy.cn'
      // }

      '/api': {
        //代理地址
        target: 'http://thankjava.oicp.net/', //需要代理的地址
        changeOrigin: true, //是否跨域
        secure: false,
        baseURL: 'http://thankjava.oicp.net/',
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
  },
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '在线图床服务',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      // chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json', '.css'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
        '~styles': resolve('src/assets/styles')
      }
    }
  }
};
