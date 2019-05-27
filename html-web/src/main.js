// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {
    Button,
    Form,
    FormItem,
    Input,
    Checkbox,
    Alert,
    Menu,
    MenuItem,
    Submenu,
    Row,
    Col,
    Card,
    Pagination,
    Dialog,
    Steps,
    Step,
    Tabs,
    TabPane,
    Table,
    TableColumn,
    MenuItemGroup
} from 'element-ui'
import './assets/styles/index.css';
import './assets/styles/animate.min.css';
import store from './store'
// 全局配置对象，size用于改变组件的默认尺寸，zIndex设置弹框的初始z-index
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Alert)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(MenuItemGroup)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})