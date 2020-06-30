import axios from 'axios';
import store from '../../store/index.js'
import router from '../../router/index.js'

import {
    Message
} from 'ant-design-vue';

let service = axios.create();

// 请求拦截器
// service.interceptors.request.use(
//     error => {
//         return Promise.reject(error);
//     }
// )

// 响应拦截器
service.interceptors.response.use(
    response => {
        const {status} = response.data;
        if(Object.is(status, 401)) {
            // token过期，登录失效
            this.$router.push('/login');
        }
        return response;
    },
    error => {
        return Promise.reject(error);
    }
)

// 使用es6中的类进行简单的封装
class http {
    static async get(url, params) {
        return await service.get(url, {params});
    }

    static async post(url, params) {
        return await service.post(url, params);
    }
}



// function onloadF(url, data, methods) {
//     return new Promise((resolve) => {
//         let state = store.state;
//         let windowCONTEXT = state.windowCONTEXT;
//         let loginUser = state.loginUser;
//         data.loginUser = loginUser;
//         axios({
//             method: methods,
//             url: windowCONTEXT + url,
//             data: data,
//             contenType: 'application/json',
//             headers: {
//                 'X-Requested-With': 'XMLHttpRequest'
//             },
//         }).then(function (rep) {
//             if (rep.data.code == '0') {

//             } else {
//                 Message.error(rep.data.msg || '系统异常，请重试')
//             }
//         })
//     })
// }

export default http;
