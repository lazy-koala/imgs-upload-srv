<template>
    <div>
        <template>
            <common-header isIndex="1"></common-header>
        </template>
        <div class="content-wrapper">
            <el-tabs v-loading="dataLoading" tab-position="left" v-model="activeName" class="menu-wrapper"  @tab-click="tokenTab">
                <el-tab-pane height="80px" name="person_headimg">
                    <span slot="label"><i class="el-icon-userp gap"></i>头像昵称</span>
                    <headImg-nickName class="tab-right"></headImg-nickName>
                </el-tab-pane>
                <el-tab-pane name="person_pwd">
                    <span slot="label"><i class="el-icon-mail gap"></i>密码邮箱</span>
                    <mail-code class="tab-right"></mail-code>
                </el-tab-pane>
                <el-tab-pane name="person_token">
                    <span slot="label"><i class="el-icon-key gap"></i>token管理</span>
                    <token :tokenList="tokenList" @refreshToken="getToken"></token>
                </el-tab-pane>
            </el-tabs>
        </div>
        <template class='footer'>
            <common-footer></common-footer>
        </template>
    </div>

</template>
<script type="text/javascript">
    import CommonHeader from "./common/CommonHeader";
    import CommonFooter from "./common/CommonFooter";
    import Cookies from "js-cookie";
    import HeadImg from "./common/Person/HeadImg";
    import MailCode from "./common/Person/MailCode";
    import Token from "./common/Person/Token";
    import $axios from 'axios';

    export default {
        name: 'Person',
        components: {
            'common-header': CommonHeader,
            'common-footer': CommonFooter,
            'headImg-nickName': HeadImg,
            'mail-code': MailCode,
            'token': Token
        },
        data () {
            return {
                tokenList: [],
                activeName: '',
                dataLoading: false
            }
        },
        methods: {
            tokenTab: function (tab, event) {
                if (tab.index == 2) {
                    this.getToken();
                }
            },
            getToken: function() {
                this.dataLoading = true;
                $axios.get('/api/token/list').then((res) => {
                    if (res && res.data && !res.data.code) {
                        this.dataLoading = false;
                       this.tokenList = res.data.data.list || [];
                    } else {
                        Message.error({
                            message: res.data.message,
                            center: true
                       });
                      return false;
                    }
                });
            },
            
        },
        // computed: {
        //     activeName() {
        //         // 根据路由参数判断显示 头像昵称person_headimg、密码邮箱1-2、token管理1-3
        //         return this.$route.params.index || 'person_headimg';
        //     }
        // },
        beforeMount () {
            let uinfo = Cookies.get('uinfo') || '';
            let that = this;
            if (!uinfo || uinfo == '') {
                this.$router.push('/');
                return false;
            }
            $axios.get('/api/user/uinfo').then((res) => {
                if (res.data && res.data.data) {
                    var info = res.data.data || {};
                    that.$store.commit('changeInfo', info);
                }
            }).catch(function (error) {
                // that.catchError(error);
            })

            // 第一次路由过来加载组件
            this.activeName = this.$route.query.index || 'person_headimg';
            if(this.activeName == 'person_token') {
                this.getToken();
            }
        },
        watch: {
            // 监听路由参数发生变化
            $route() {
                this.activeName = this.$route.query.index || 'person_headimg';
                if(this.activeName == 'person_token') {
                    this.getToken();
                }
            }
        }     
    }
</script>
<style type="text/css">
    .menu-wrapper {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 80px;
        bottom: 80px;
        overflow-y: scroll;
    }

    .content-wrapper .el-tabs__item {
        height: 80px;
        line-height: 80px;
    }
    .gap {
        padding-right: 6px;
    }
    .el-tab-pane {
        width: 1000px;
        margin: 50px auto;
    }
    .el-form-item__content {
        display: flex;
    }
    .tab-right {
        width: 70%;
    }
</style>