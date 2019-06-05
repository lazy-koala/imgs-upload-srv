<template>
<div class="menu">
    <div class="title-wrapper">
        <span :class="['element-icons', 'menu',isCollapse ? 'el-icon-menuoff' : 'el-icon-menuon']" @click="taggleMenuList"></span>
        <div class="title" @click="gotoIndex">在线图床服务</div>        
    </div>
    <div class="menu-list" v-show="isCollapse">
        <el-menu
            default-active="index"
            
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
                    <el-menu-item class="element-icons el-icon-renyuan" index="person_headimg">头像昵称</el-menu-item>
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
    <div class="menu-wrapper" @click="taggleMenuList" v-show="isCollapse"></div>
    <div class="tip">
        <img v-show="headImg" class="head-img" :src="headImg">
        <span>{{nickname}},欢迎你~</span>
        <!-- <span v-if="isIndex==0" class="exit" @click="gotoPerson">个人中心</span> -->
        <!-- <span v-if="isIndex==1" class="exit" @click="gotoIndex">返回首页</span> -->
        <!-- <span class="exit">|</span> -->
        <!-- <span class="exit" @click="logout">退出</span> -->
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
            }
        },
        data() {
            return {
                isCollapse: false,
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
            // 切换显示侧边栏
            taggleMenuList: function () {
                this.isCollapse = !this.isCollapse;
            },
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
                this.isCollapse = false;
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
<style type="text/css" scoped>
.head-img {
    display: inline-block;
    width: 30px;
    height: 30px;
    padding-right: 20px;
}
.menu {
    position: relative;
    background: #409EFF;
    color: #fff;
    font-size: 24px;
}
.menu-wrapper {
    position: fixed;
    z-index: 888;
    top: 50px;
    bottom: 60px;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
}
.menu-list {
    position: fixed;
    /* background: rgb(84, 92, 100); */
    z-index: 999;
    top: 50px;
    bottom: 60px;
    width: 200px;
    -moz-box-shadow: 1px 2px 2px rgba(221,221,221, 0.5); 
    -webkit-box-shadow: 1px 2px 2px rgba(221,221,221, 0.5);
    box-shadow: 1px 2px 2px rgba(221,221,221, 0.5);
    background: #fff; 
}
.el-menu {
    border: none;
    span {
        font-size: 18px;        
    }
    li {
        font-size: 16px;
    }
}
.title-wrapper {
    position: relative;
    display: -webkit-box;
    -webkit-box-align: center;
    .el-icon-menuon, .el-icon-menuoff {
        position: absolute;
        top: 0;
    }
    .title {
        margin-left: 50px;
        line-height: 50px;
        cursor:pointer;
    }
    span {
        font-size: 28px;
        display: inline-block;
        line-height: 50px;
        margin-left: 10px;
        cursor:pointer;
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
    line-height: 30px;
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
</style>