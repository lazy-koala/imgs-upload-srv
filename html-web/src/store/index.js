import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
    state:{
        email: "",
        headImg: "",
        id: "",
        nickname: "",
        username: ""
    },
    mutations: {
        changeInfo (state, data) {
            for (var item in data) {
                localStorage.setItem(item, (data[item] ? data[item] : ''));
                state[item] = data[item];
            }
        }
    }
})