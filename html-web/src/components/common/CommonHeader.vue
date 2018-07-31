<template>
<div class="menu">
    <h1>在线图片服务</h1>
    <div class="tip">
        <img class="head-img" :src="headImg">
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
    height: 80px;
    background: #409EFF;
    color: #fff;
    font-size: 24px;
    h1 {
        float: left;
        line-height: 80px;
        padding-left: 20px;
    }
}
.tip {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
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