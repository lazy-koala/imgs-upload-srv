import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/components/Index'
import Person from '@/components/Person'
import Category from "@/components/Category";
import HeadImg from "@/components/common/Person/HeadImg";
import MailCode from "@/components/common/Person/MailCode";
import Token from "@/components/common/Person/Token";
import Share from "@/components/Share";
Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/index',
            name: 'index',
            component: Index
        },
        {
            path: '/person',
            name: 'person',
            component: Person
        },
        {
            path: '/category',
            name: 'category',
            component: Category
        },
        {
            path: '/share',
            name: 'share',
            component: Share
        },
        {
            path: '*',
            redirect: '/'
        }
    ],
    mode: 'history'
})