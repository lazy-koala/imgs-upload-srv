<template>
<div class="menu">
    <div class="title-wrapper">
        <span class="icon el-icon-menu" @click="taggleMenuList"></span>
        <div class="title">在线图床服务</div>
    </div>
    <div class="menu-list" v-show="isCollapse">
        <el-menu
            default-active="1"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
        >
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>个人中心</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="1-1">头像昵称</el-menu-item>
                    <el-menu-item index="1-2">密码邮箱</el-menu-item>
                    <el-menu-item index="1-3">Token管理</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">分类管理</span>
            </el-menu-item>
        </el-menu>
    </div>
    <div class="tip">
        <img v-show="headImg" class="head-img" :src="headImg">
        <span>{{nickname}},欢迎你~</span>
        <span v-if="isIndex==0" class="exit" @click="gotoPerson">个人中心</span>
        <span v-if="isIndex==1" class="exit" @click="gotoIndex">返回首页</span>
        <span class="exit">|</span>
        <span class="exit" @click="logout">退出</span>
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
                isCollapse: false
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
            gotoPerson: function () {
                this.$router.push('/person');
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
    height: 55px;
}
.menu-list {
    position: fixed;
    background: rgb(84, 92, 100);
    z-index: 999;
    top: 55px;
    bottom: 65px;
    width: 200px;
}
.el-menu {
    border: none;
}
.title-wrapper {
    position: relative;
    .el-icon-menu {
        position: absolute;
    }
    .title {
        margin-left: 50px;
        line-height: 50px;
    }
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