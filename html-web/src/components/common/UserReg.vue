<template>
    <div class="form-wrapper">
        <el-form  label-position="right" label-width="100px" :model="regForm" ref="regForm" :rules="rules">
            <el-form-item prop="nickname" label="昵称">
                <el-input placeholder="请输入昵称"
                v-model="regForm.nickname"
                minlength="6" maxlength="8"
                >
                </el-input>
            </el-form-item>
            <el-form-item prop="username" label="用户名">
                <el-input
                    placeholder="请输入用户名"
                    v-model="regForm.username"
                    minlength="6" maxlength="8"
                    :disabled="isDisable"
                    >
                </el-input>
            </el-form-item>

            <el-form-item prop="password" label="密码">
                <el-input type="password" placeholder="请输入密码" v-model="regForm.password">
                </el-input>
            </el-form-item>

            <el-form-item prop="mail" label="邮箱">
                <el-input type="mail" placeholder="请输入邮箱地址" v-model="regForm.mail" :disabled="isDisable">
                    <el-button slot="append" class="timer-btn" type="text" @click="beginTimer('regForm')" v-if="sendStatus==0">获取验证码</el-button>
                    <el-button slot="append" class="timer-btn" type="text" v-if="sendStatus==1">发送中</el-button>
                    <el-button slot="append" class="timer-btn" type="text" v-if="sendStatus==2">{{timer}}s</el-button>
                    <!-- <timer @click="validMail" slot="append" :canUse="canUse" :isShowTimer="isShowTimer"></timer> -->
                </el-input>
            </el-form-item>

            <el-form-item prop="mailCode" label="邮箱验证码">
                <el-input type="text" placeholder="请输入邮箱验证码" v-model="regForm.mailCode">
                </el-input>
            </el-form-item>
        </el-form>
        <div class="reg-btn">
            <el-button type="primary" :disabled="!canClick" @click="regUser('regForm')">注册</el-button>
        </div>
    </div>
</template>

<script type="text/javascript">
    import Timer from './Timer';
    import $axios from 'axios';
    import { Message } from 'element-ui';
    export default {
        "name": 'UserReg',
        data () {
            var  validateUsername = (rule, value, callback) => {
                var reg = /^[a-zA-Z0-9_-]{4,16}$/;
                if (!reg.test(value)) {
                    callback(new Error('用户名为数字或者字母，长度为4~16个字符'));
                } else {
                    callback();
                }
            };

            var validatePwd = (rule, value, callback) => {
                var reg = /^[a-zA-Z0-9_-]{6,20}$/;
                if (!reg.test(value)) {
                    callback(new Error('密码为数字或者字母，长度为6~20个字符'));
                } else {
                    callback();
                }
            };

            var validateNickName = (rule, value, callback) => {
                if (value == '' || (value.length >= 3 && value.length <= 8)) {
                    callback();
                } else {
                    callback(new Error('昵称的长度为3~8个字符'));
                }
            };

            var validateCode = (rule, value, callback) => {
                var reg = /^[0-9]{6}$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error('邮箱验证码为数字，长度为6位'));
                }
            };

            return {
                regForm: {
                    username: '',
                    password: '',
                    mail: '',
                    mailCode: '',
                    nickname: ''
                },
                rules: {
                    username: [
                        { required: true, message: '用户名不能为空', trigger: 'change' },
                        {validator: validateUsername, trigger: 'change' }
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'change'},
                        {validator: validatePwd, trigger: 'change'}
                    ],
                    mail: [
                        {
                            required: true, message: '邮箱地址不能为空', trigger: 'change'
                        },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    mailCode: [
                        {required: true, message: '邮箱验证码不能为空', trigger: 'change'},
                        {validator: validateCode, trigger: 'change' }
                    ],
                    nickname: [
                        {validator: validateNickName, trigger: 'change' }
                    ]
                },
                sendStatus: 0, //0待发送 1发送中 2已发送
                // canUse: false,
                totalTime: 90,
                timer: this.totalTime,
                token: '',
                interval: null,
                isDisable: false,
                canClick: false
            }

        },
        watch: {
            sendStatus: function () {
                return this.sendStatus;
            }
        },
        methods: {
            beginTimer: function (formName) {
                let that = this;
                let valid1 = '';
                let valid2 = '';
                if (this.sendStatus != 0) {
                    return false;
                }

                this.$refs[formName].validateField('mail', (valid) => {
                    valid1 = valid;
                });

                this.$refs[formName].validateField('username', (valid) => {
                    valid2 = valid;
                });

                if (valid1 || valid2) {
                    this.sendStatus = 0;
                    this.isDisable = false;
                } else {
                    this.isDisable = true;
                    this.sendStatus = 1;
                    this.getMailCode();
                }
            },

            getMailCode: function () {
                var that = this;
                var regData = that.regForm;
                var username = regData.username;
                var mail = regData.mail;
                var nickname = regData.nickname;
                $axios.post('/api/send_reg_mail_code', {
                    "username": (username || '').replace(/\s/g, ''),
                    "mail": (mail || '').replace(/\s/g, ''),
                    "nickname": (nickname || '').replace(/\s/g, '')
                }).then((res) => {
                    if (res && res.data && !res.data.code) {
                        this.sendStatus = 2;
                        this.isDisable = true;
                        this.canClick = true;
                        this.timer = this.totalTime;
                        this.interval ? clearInterval(this.interval) : '';
                        this.interval = setInterval(this.timerHandle, 1000);
                        that.token = res.data.data.token;
                        Message.success({
                            message: "验证码已发送，请查收邮件",
                            center: true,
                            type: 'info'
                        });
                    } else {
                        that.isDisable = false;
                        that.sendStatus = 0;
                        that.canClick = false;
                        Message.error({
                            message: res.data.message,
                            center: true
                        });
                        return false;
                    }
                });
            },

            timerHandle: function () {
                if (this.timer == 1) {
                    this.sendStatus = 0;
                    this.isDisable = false;
                }
                if (this.timer > 1) {
                    this.timer --;
                }
            },

            // 注册
            regUser: function (formName) {
                var that = this;
                var regData = that.regForm;
                that.$refs[formName].validate((valid) => {
                    if (valid && that.token)  {
                        $axios.post('/api/registe', {
                            "username": (regData.username || '').replace(/\s/g, ''),
                            "password": (regData.password || '').replace(/\s/g, ''),
                            "mailCode": (regData.mailCode || '').replace(/\s/g, ''),
                            "mail": (regData.mail || '').replace(/\s/g, ''),
                            "nickname": (regData.nickname || '').replace(/\s/g, ''),
                            "token": that.token
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
                        });
                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>

<style type="text/css" scoped>
    .form-wrapper {
        width: 90%;
        margin: 0 auto;
    }
    .reg-btn {
        text-align: center;
        button {
            width: 35%;
        }
    }
    .el-input-group__append {
        .timer-btn {
            width: 100px;
            text-align: center;
        }
    }

</style>