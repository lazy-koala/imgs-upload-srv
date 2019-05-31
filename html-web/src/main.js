// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/styles/index.css';
import './assets/styles/animate.min.css';
import store from './store'
// 全局配置对象，size用于改变组件的默认尺寸，zIndex设置弹框的初始z-index
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };

Vue.config.productionTip = false

/* eslint-disable no-new */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})