<template>
  <div class="wrapper">
    <div class="login-wrapper">
        <h1 class="title">在线图片服务</h1>
        <el-form class="form" status-icon :model="loginForm" ref="loginForm" :rules="rules">
            <el-form-item prop="username">
                <el-input clearable
                    placeholder="请输入用户名或者邮箱"
                    v-model="loginForm.username"
                    auto-complete="off"
                    >
                    <i slot="prefix" class="el-input__icon el-icon-user"></i>
                </el-input>
            </el-form-item>

            <el-form-item prop="password">
                <el-input type="password" auto-complete="off" clearable placeholder="请输入密码" v-model="loginForm.password">
                    <i slot="prefix" class="el-input__icon el-icon-pwd"></i>
                </el-input>
            </el-form-item>
            <div class="extra-info">
                <el-checkbox v-model="loginForm.keepLogged">记住我</el-checkbox>
                <div class="btn-text">
                    <el-button type="text" @click="showResetPwdHandler">忘记密码？</el-button>
                    <el-button type="text">|</el-button>
                    <el-button type="text" @click="showRegHandler">点我注册</el-button>
                </div>
            </div>

        </el-form>
        <div class="btn-wrapper">
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
        </div>
    </div>
    <el-dialog
    title="用户注册"
    :visible.sync="showReg"
    width="550px"
    center
    >
        <user-reg></user-reg>
    </el-dialog>

    <el-dialog
    title="找回密码"
    :visible.sync="showReset"
    width="550px"
    center
    >
        <user-reset></user-reset>
    </el-dialog>
  </div>
</template>

<script>
import $axios from 'axios';
import { Message } from 'element-ui';
import Cookies from "js-cookie";
import UserReg from "./common/UserReg";
import UserReset from "./common/UserReset";
export default {
    name: 'Login',
    components: {
        'user-reg': UserReg,
        'user-reset': UserReset
    },
    data () {
        return {
            loginForm: {
                username: '',
                password: '',
                keepLogged: false
            },
            rules: {
                username: [
                    { required: true, message: '邮箱或者用户名不能为空', trigger: 'blur' }
                ],
                password: [{
                    required: true, message: '密码不能为空', trigger: 'blur'
                }]
            },
            showReg: false,
            showReset: false
        }
    },
    methods: {
        submitForm: function (formName) {
            let that = this;
            let formData = this.loginForm;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    $axios.post('/api/login', {
                        "username": (formData.username || '').replace(/\s/g, ''),
                        "password": (formData.password || '').replace(/\s/g, ''),
                        "keepLogged": formData.keepLogged
                    }).then((res) => {
                        if (res && res.data && !res.data.code) {
                            that.$router.push('/index');
                        } else {
                             Message.error({
                                message: res.data.message,
                                center: true
                            });
                            return false;
                        }
                        // that.$router.push('/index');

                    });
                } else {
                    return false;
                }
            })
        },

        showRegHandler: function () {
            this.showReg = true;
        },

        showResetPwdHandler: function () {
            this.showReset = true;
        }
    },

    mounted () {
        let uinfo = Cookies.get('uinfo') || '';
        if (uinfo && uinfo != '') {
            this.$router.push('/index');
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*@import '~@styles/iconfont.css';*/

.wrapper {
    position: relative;
    overflow: hidden;
    width: 100%;
    background-image: url('../assets/images/bg.jpg');
    background-size: 300%;
}
.login-wrapper {
    width: 400px;
    padding: 30px 30px 5px 30px;
    margin: 150px auto;
    background: #fff;
    border-radius: 5px;
    .title {
        text-align: center;
        color: #409EFF;
        font-size: 20px;
        font-weight: 500;
    }
}
.form {
    width: 80%;
    margin: 20px auto;
}
.el-icon-user, .el-icon-pwd {
    font-size: 18px;
    color: #409EFF;
}

.extra-info {
    display: flex;
    align-items: center;
}

.btn-wrapper {
    margin: 0px auto 20px auto;
    text-align: center;
    button {
        width: 80%;
    }
}

.btn-text {
    flex: 1;
    text-align: right;
    .el-button {
        margin-left: 0px;
    }
}
</style>
