// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/styles/index.css';
import './assets/styles/animate.min.css';
import store from './store'
import $axios from 'axios';
import Commonjs from './assets/scripts/common.js';
// 全局配置对象，size用于改变组件的默认尺寸，zIndex设置弹框的初始z-index
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };

Vue.config.productionTip = false

Vue.prototype.catchError = Commonjs.catchError;

/* eslint-disable no-new */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import { createNamespacedHelpers } from 'vuex';
Vue.prototype.$axios = $axios;
Vue.use(ElementUI)
// Vue.use($axios);
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})