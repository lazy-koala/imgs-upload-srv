import Vue from 'vue'
import vuex from 'vuex'
import $axios from 'axios'

Vue.use(vuex);

export default new vuex.Store({
    state: {
        email: "",
        headImg: "",
        id: "",
        nickname: "",
        username: "",
        sortList: []
    },
    mutations: {
        changeInfo(state, data) {
            for (var item in data) {
                localStorage.setItem(item, (data[item] ? data[item] : ''));
                state[item] = data[item];
            }
        },
        updateSortList(state, sortList) {
            state.sortList = sortList;
        }
    },
    actions: {
        getSortList({ state, commit }, params) {
            return new Promise((resolve, reject) => {
                let sortList = [...state.sortList] || [];
                // type==get获取分类的操作
                // type=update编辑新增分类的操作，需要重新获取分类列表
                if (params.type == 'get' && sortList.length > 0) {
                    commit('updateSortList', sortList);
                    resolve(sortList);
                } else {
                    $axios.get('/api/sort/list', { params: { sortId: params.sortId, sortName: params.sortName } }).then((res) => {
                        let sortList = [];
                        // if (params.type == 'get') {
                        //     sortList = [{ sortId: "", sortName: "全部分类" }, ...(res.data && res.data.data && res.data.data.list || [])];
                        // } else {
                        // }
                        sortList = [...(res.data && res.data.data && res.data.data.list || [])];

                        commit('updateSortList', sortList);
                        resolve(sortList);
                    })
                }

            })
        }
    }
})