import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/components/Index'
import Person from '@/components/Person'
Vue.use(Router)

export default new Router({
  routes: [
    {
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
      path: '*',
      redirect:'/'
    }
  ],
  mode: 'history'
})
