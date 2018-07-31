<template>
    <div class="find-wrapper">
        <el-steps :active="active" finish-status="success" simple center>
            <el-step title="发送验证码"></el-step>
            <el-step title="重置密码"></el-step>
        </el-steps>
        <el-form v-show="active==0" class="form-wrapper" label-position="right" label-width="100px" :model="getCodeForm" ref="getCodeForm" :rules="codeRules">
            <el-form-item prop="username" label="用户名">
                <el-input
                    placeholder="请输入用户名"
                    v-model="getCodeForm.username"
                    :disabled="isDisable"
                    >
                </el-input>
            </el-form-item>
            <el-form-item prop="mail" label="邮箱">
                <el-input type="mail" placeholder="请输入邮箱地址" v-model="getCodeForm.mail" :disabled="isDisable">
                    <el-button slot="append" class="timer-btn" type="text" @click="beginTimer('getCodeForm')" v-if="sendStatus==0">获取验证码</el-button>
                    <el-button slot="append" class="timer-btn" type="text" v-if="sendStatus==1">发送中</el-button>

                    <el-button slot="append" class="timer-btn" type="text" v-if="sendStatus==2">{{timer}}s</el-button>
                </el-input>
            </el-form-item>
            <el-form-item prop="mailCode" label="邮箱验证码">
                <el-input type="text" placeholder="请输入邮箱验证码" v-model="getCodeForm.mailCode">
                </el-input>
            </el-form-item>
            <div class="btn-wrapper">
                <el-button type="primary" :disabled="!canClick" @click="nextStep('getCodeForm')">下一步</el-button>
            </div>
        </el-form>

        <el-form v-show="active==1" :model="resetForm" class="form-wrapper" label-position="right" label-width="100px" ref="resetForm" :rules="resetRules">
            <el-form-item prop="pwd" label="新密码">
                <el-input type="password" placeholder="请输入密码" v-model="resetForm.pwd">
                </el-input>
            </el-form-item>
            <el-form-item prop="checkPwd" label="确认密码">
                <el-input type="password" placeholder="请输入密码" v-model="resetForm.checkPwd">
                </el-input>
            </el-form-item>
            <div class="btn-wrapper">
                <el-button type="primary" @click="goBack()">上一步</el-button>
                <el-button type="primary" @click="cofirmReset('resetForm')">确认重置</el-button>
            </div>
        </el-form>
    </div>
</template>
<script type="text/javascript">
    import $axios from 'axios';
    import { Message } from 'element-ui';
    export default {
        "name": 'UserReset',
        data () {
            var  validateUsername = (rule, value, callback) => {
                var reg = /^[a-zA-Z0-9_-]{4,16}$/;
                if (!reg.test(value)) {
                    callback(new Error('用户名为数字或者字母，长度为4~16个字符'));
                } else {
                    callback();
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

            var validateCode = (rule, value, callback) => {
                var reg = /^[0-9]{6}$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error('邮箱验证码为数字，长度为6位'));
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

            var validateCheckPwd = (rule, value, callback) => {
                var reg = /^[a-zA-Z0-9_-]{6,20}$/;
                if (!reg.test(value)) {
                    callback(new Error('密码为数字或者字母，长度为6~20个字符'));
                } else if (value !== this.resetForm.pwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }

            return {
                getCodeForm: {
                    username: '',
                    mail: '',
                    mailCode: ''
                },
                resetForm: {
                    pwd: '',
                    checkPwd: ''
                },
                codeRules: {
                    username: [
                        { required: true, message: '用户名不能为空', trigger: 'change' },
                        {validator: validateUsername, trigger: 'change' }
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
                    ]
                },
                resetRules: {
                    pwd: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {validator: validatePwd, trigger: 'change'}
                    ],
                    checkPwd: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {validator: validateCheckPwd, trigger: 'change'}
                    ]
                },
                sendStatus: 0,
                // canUse: false,
                totalTime: 90,
                timer: this.totalTime,
                token: '',
                interval: null,
                isDisable: false,
                canClick: false, //下一步是否可点击
                active: 0
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
                var data = that.getCodeForm;
                var mail = data.mail;
                var username = data.username;
                $axios.post('/api/forget_pwd', {
                    "username": (username || '').replace(/\s/g, ''),
                    "mail": (mail || '').replace(/\s/g, '')
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
                        that.canClick = false;
                        that.sendStatus = 0;
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
            nextStep: function (formName) {
                var that = this;
                var regData = that.regForm;
                that.$refs[formName].validate((valid) => {
                    that.active = 1;
                });
            },
            goBack: function () {
                this.active = 0;
            },
            cofirmReset: function (formName) {
                var that = this;
                var reqData = {
                    "token": that.token,
                    "password": that.resetForm.pwd,
                    "mailCode": that.getCodeForm.mailCode
                };
                that.$refs[formName].validate((valid) => {
                    if (valid && that.token)  {
                        $axios.post('/api/reset_pwd', reqData).then((res) => {
                            if (res && res.data && !res.data.code) {
                                Message.success({
                                    message: res.data.message,
                                    center: true,
                                    type: 'info'
                                });
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
    .find-wrapper {
        border: 1px solid #f5f7fa;
        border-radius: 4px;
    }
    .form-wrapper {
        width: 80%;
        margin: 30px auto;
    }

    .btn-wrapper {
        text-align: center;
        button {
            width: 40%;
        }
    }
    .timer-btn {
        display: inline-block;
        width: 80px;
        text-align: center;
    }
</style>