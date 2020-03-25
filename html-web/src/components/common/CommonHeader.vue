<template>
<div class="header-menu">
    <div class="title-wrapper">
        <!-- <span v-if="isIndex != 2" :class="['element-icons', 'menu',isCollapse ? 'el-icon-menuoff' : 'el-icon-menuon']" @click="taggleMenuList"></span> -->
        <div class="title" @click="gotoIndex">在线图床服务</div>   
        <el-menu
            default-active="index"
            mode="horizontal"
            @select="gotoMenu"
        >
            <el-menu-item index="index">
                <i class="element-icons el-icon-menu"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="person">
                <template slot="title">
                    <i class="element-icons el-icon-person"></i>
                    <span>个人中心</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="person_headimg">头像昵称</el-menu-item>
                    <el-menu-item index="person_pwd">密码邮箱</el-menu-item>
                    <el-menu-item index="person_token">Token管理</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="category">
                <i class="element-icons el-icon-menu"></i>
                <span slot="title">分类管理</span>
            </el-menu-item>            
            <el-menu-item index="exit">
                <i class="element-icons el-icon-exit"></i>
                <span slot="title">退出</span>
            </el-menu-item>
        </el-menu>    
    </div>     
    
    <div class="tip" v-if="isIndex != 2">
        <img v-show="headImg" class="head-img" :src="headImg">
        <span>{{nickname}},欢迎你~</span>
        <!-- <span v-if="isIndex==0" class="exit" @click="gotoPerson">个人中心</span> -->
        <!-- <span v-if="isIndex==1" class="exit" @click="gotoIndex">返回首页</span> -->
        <!-- <span class="exit">|</span> -->
        <!-- <span class="exit" @click="logout">退出</span> -->
    </div>
    <div class="tip" v-if="isIndex == 2 && shareUser">
        <span>{{`来自${shareUser}的分享~`}}</span>
    </div>
</div>
</template>
<script type="text/javascript">
import $axios from 'axios';
import Cookies from "js-cookie";
import { Message } from 'element-ui';

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
        methods: {
           
            logout: function () {
                var that = this;
                $axios.get('/api/logout').then((res) => {
                    if (res.data) {
                        Message.success({
                            message: res.data.message || '退出成功！',
                            type: 'info',
                            center: true
                        });
                        that.$router.push('/');
                    }
                })
            },
            gotoMenu: function (key, keyPath) {
                // 关闭侧边栏菜单
                switch (key) {
                    case 'person_headimg': case 'person_token': case 'person_pwd':
                        this.$router.push({
                            name: 'person',
                            query: {
                                index: key
                            }
                        });
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
            },
            gotoIndex: function () {
                this.$router.push('/index');
            }
        }        
    }
</script>
<style type="text/css">
.header-menu {
    position: relative;
    background: #409EFF;
    color: #fff;
    font-size: 24px;
    .head-img {
        display: inline-block;
        width: 30px;
        height: 30px;
        padding-right: 20px;
    }
    .el-menu {
        margin-right: 160px;
        border: none;
        background: none;
        span {
            font-size: 12px;        
        }
        li {
            font-size: 14px;
        }
        li:hover {
            background: none;
        }
        
        &.el-menu--horizontal > .el-menu-item.is-active {
            color: #fff;
        }
        .el-menu-item:focus,.el-menu-item:hover {
            outline: 0;
            background-color: initial;
        }
        .el-dropdown-menu__item--divided:before,
        &.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
        &.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
        &.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
            background-color: initial;
        }
        .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
            background-color: initial !important;
        } 
        .el-menu-item-group .el-menu-item:hover {
            background-color: rgba(0, 0, 0, 0.4) !important;
        }
    }

  

    .title-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .el-icon-menuon, .el-icon-menuoff {
            position: absolute;
            top: 0;
        }
        .element-icons {
            color: #fff;
        }
        .title {
            margin-left: 20px;
            cursor:pointer;
            flex: 1;
        }
        span {
            font-size: 14px;
            display: inline-block;
            margin-left: 10px;
            cursor:pointer;
            color: #fff;
        }
    }

    .sort {
        height: 100%;
        margin-left: 20px;
    }
    .tip {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        line-height: 40px;
        bottom: 10px;
        right: 10px;
        font-size: 14px;
    }
    .exit {
        padding-left: 10px;
        color: #fff;
        cursor: pointer;
    }
    .exit:hover{
        cursor: pointer
    }
}
</style>