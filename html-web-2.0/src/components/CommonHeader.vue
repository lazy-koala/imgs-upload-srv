<template>
<div class="header-menu">
    <div class="title-wrapper">
        <div class="title">
            <span @click="gotoMenu('index')">在线图床服务</span>
        </div>   
        <a-menu class="menu-wrapper" mode="horizontal">
            <a-menu-item @click="gotoMenu('index')" key="index"> <a-icon type="home" />首页 </a-menu-item>
            <a-sub-menu>
                <span slot="title"><a-icon type="setting" />个人中心</span>
                <a-menu-item-group>
                    <a-menu-item @click="gotoMenu('person_headimg')" key="person_headimg">头像昵称</a-menu-item>
                    <a-menu-item @click="gotoMenu('person_pwd')" key="person_pwd">密码邮箱</a-menu-item>
                    <a-menu-item @click="gotoMenu('person_token')" key="person_token">Token管理</a-menu-item>
                </a-menu-item-group>
            </a-sub-menu>
            <a-menu-item key="category" @click="gotoMenu('category')"> <a-icon type="apartment" />分类管理</a-menu-item>
            <a-menu-item key="exit" @click="gotoMenu('exit')"> <a-icon type="logout" />退出</a-menu-item>
        </a-menu>
    </div>   
    <div class="head-img" v-if="isIndex != 2">
        <img v-show="headImg" :src="headImg">
    </div> 
    <div class="tip" v-if="isIndex == 2 && shareUser">
        <span>{{`来自${shareUser}的分享~`}}</span>
    </div>
</div>
</template>
<script type="text/javascript">
import {logout} from '../assets/commonjs/api';
    export default {
        name: 'CommonHeader',
        props: {
            isIndex: {
                type: String
            },
            shareUser: {
                type: String
            }
        },
        data() {
            return {
            }
        },
        computed: {
            nickname () {
                return this.$store.state.nickname
            },
            headImg () {
                return this.$store.state.headImg;
            }
        },
        created() {
            // this.logout();
        },
        methods: {
            logout: function () {
                logout().then(res => {
                    console.log('res: ', res);
                    
                })
            },
            gotoPage(key) {
                console.log('key: ', key);

            },
            gotoMenu: function (key) {
                // 关闭侧边栏菜单
                switch (key) {
                    case 'person_headimg': 
                    case 'person_token': 
                    case 'person_pwd':
                        this.$router.push(
                            { 
                                path: '/person', 
                                query: { index: key }
                            }
                        );
                        break;
                    
                    case 'category':
                        this.$router.push('/category')
                        break;

                    case 'index':
                        this.$router.push('/')
                        break;

                    case 'exit':
                        this.logout();
                        break;                    

                    default:
                        break;
                }
            }
        }        
    }
</script>
<style type="text/css" lang="scss">
.header-menu {
    position: relative;
    background: $primary;
    color: #fff;
    font-size: 24px;
    height: 60px;
    .head-img, .tip{
        position: fixed;
        // right: 470px;
        right: 10px;
        top: 10px;
        img {
            border-radius: 20px;
            width: 40px;
            height: 40px;
        }
    }
    .tip {
        top: 20px;
        font-size: 16px;
    }

    .title-wrapper {
        padding-right: 40px;
        position: relative;
        display: flex;
        align-items: center;
        line-height: 60px;
        justify-content: space-between;
        .title {
            margin-left: 20px;
            cursor:pointer;
            width: 200px;
            flex: 1;
        }
        .anticon {
            font-size: 16px;
        }
    }
}
</style>