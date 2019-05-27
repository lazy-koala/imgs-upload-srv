import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/components/Index'
import Person from '@/components/Person'
import HeadImg from "@/components/common/Person/HeadImg";
import MailCode from "@/components/common/Person/MailCode";
import Token from "@/components/common/Person/Token";
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
            component: Person,
            // children: [{
            //         path: '/headimg',
            //         name: 'headimg',
            //         component: HeadImg
            //     },
            //     {
            //         path: '/mailcode',
            //         name: 'mailcode',
            //         component: MailCode
            //     },
            //     {
            //         path: '/token',
            //         name: 'token',
            //         component: Token
            //     }
            // ]
        },
        {
            path: '*',
            redirect: '/'
        }
    ],
    mode: 'history'
})