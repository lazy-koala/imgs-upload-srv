<template>
    <div>
        <el-form  label-position="right" label-width="100px" :model="mailForm" ref="mailForm" :rules="mailRules">
            <el-form-item label="邮箱地址">
                <el-input type="mail" disabled :value="oldMail">
                </el-input>
            </el-form-item>
            <el-form-item prop="newMail" label="新邮箱地址">
                <el-input type="mail" placeholder="请输入邮箱地址" v-model="mailForm.newMail" :disabled="isMailDisabled">
                    <el-button slot="append" class="timer-btn" type="text" @click="beginTimer('mailForm')" v-if="sendStatus==0">获取验证码</el-button>
                    <el-button slot="append" class="timer-btn" type="text" v-if="sendStatus==1">发送中</el-button>
                    <el-button slot="append" class="timer-btn" type="text" v-if="sendStatus==2">{{timer}}s</el-button>
                    <!-- <timer @click="validMail" slot="append" :canUse="canUse" :isShowTimer="isShowTimer"></timer> -->
                </el-input>
            </el-form-item>

            <el-form-item prop="mailCode" label="邮箱验证码">
                <el-input type="text" placeholder="请输入邮箱验证码" v-model="mailForm.mailCode">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="!mailClick" @click="changeMail('mailForm')">修改邮箱</el-button>
            </el-form-item>
        </el-form>
        <el-form label-position="right" label-width="100px" :model="pwdForm" ref="pwdForm" :rules="pwdRules">
            <el-form-item prop="oldPwd" label="原密码">
                <el-input  type="password" placeholder="请输入原密码" v-model="pwdForm.oldPwd">
                </el-input>
            </el-form-item>
            <el-form-item prop="newPwd" label="新密码">
                <el-input  type="password" placeholder="请输入新密码" v-model="pwdForm.newPwd">
                </el-input>
            </el-form-item>
            <el-form-item prop="confirmPwd" label="确认新密码">
                <el-input  type="password" placeholder="请再次输入新密码" v-model="pwdForm.confirmPwd">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="!pwdClick" @click="changePwd('pwdForm')">修改密码</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script type="text/javascript">
    import $axios from 'axios';
    import { Message } from 'element-ui';
    import Common from '../../../assets/scripts/common.js';
    import Cookies from "js-cookie";

    export default {
        name: "mailCode",
        data () {
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
            var validateNewPwd = (rule, value, callback) => {
                if (value != this.pwdForm.newPwd) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
            return {
                mailForm: {
                    oldMail: localStorage.getItem("email"),
                    newMail: '',
                    mailCode: ''
                },
                mailRules: {
                    newMail: [
                        {required: true, message: '邮箱地址不能为空', trigger: 'change'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    mailCode: [
                        {required: true, message: '邮箱验证码不能为空', trigger: 'change'},
                        {validator: validateCode, trigger: 'change' }
                    ]
                },
                pwdForm: {
                    oldPwd: '',
                    newPwd: '',
                    confirmPwd: ''
                },
                pwdRules: {
                    oldPwd: [
                        {required: true, message: '原始密码不能为空', trigger: 'change'},
                        {validator: validatePwd, trigger: 'change'}
                    ],
                    newPwd: [
                        {required: true, message: '新密码不能为空', trigger: 'change'},
                        {validator: validatePwd, trigger: 'change'}
                    ],
                    confirmPwd: [
                        {required: true, message: '新密码不能为空', trigger: 'change'},
                        {validator: validatePwd, trigger: 'change'},
                        {validator: validateNewPwd, trigger: 'change'}
                    ]
                },
                sendStatus: 0, //0待发送 1发送中 2已发送
                totalTime: 90,
                timer: this.totalTime,
                token: '',
                interval: null,
                isMailDisabled: false,
                mailClick: true,
                pwdClick: true
            }
        },
        computed: {
            oldMail () {
                return this.$store.state.email
            }
        },
        methods: {
            beginTimer: function (formName) {
                let that = this;
                let valid1 = '';
                if (this.sendStatus != 0) {
                    return false;
                }

                this.$refs[formName].validateField('newMail', (valid) => {
                    valid1 = valid;
                });

                if (valid1) {
                    this.sendStatus = 0;
                    this.isMailDisabled = false;
                } else {
                    this.isMailDisabled = true;
                    this.mailClick = false;
                    this.sendStatus = 1;
                    this.getmailCode();
                }
            },
            getmailCode: function () {
                var that = this;
                var regData = that.mailForm;
                var mail = regData.newMail;
                $axios.post('/api/user/send_upload_mail_code', {
                    "mail": mail
                }).then((res) => {
                    if (res && res.data && !res.data.code) {
                        this.sendStatus = 2;
                        this.isMailDisabled = true;
                        this.mailClick = true;
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
                        that.isMailDisabled = false;
                        that.sendStatus = 0;
                        that.mailClick = false;
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
                    this.isMailDisabled = false;
                    this.mailClick = true;
                }
                if (this.timer > 1) {
                    this.timer --;
                }
            },
            changeMail: function (formName) {
                var that = this;
                var reqForm = that[formName];
                var formData = new FormData();
                formData.append('mail', reqForm.newMail);
                formData.append('token', that.token);
                formData.append('mailCode', reqForm.mailCode);
                that.mailClick = false;
                that.$refs[formName].validate((valid) => {
                    if (valid && that.token)  {
                        $axios.post('/api/user/update_uinfo', formData)
                        .then((res) => {
                            if (res && res.data && !res.data.code) {
                                Message.success({
                                    message: "修改邮箱成功~",
                                    center: true,
                                    type: 'info'
                                });
                                that.$refs[formName].resetFields();
                                that.sendStatus = 0;
                                that.isMailDisabled = false;
                                that.mailClick = true;
                                let info = res.data.data || {};
                                that.$store.commit('changeInfo', info);
                            } else {
                                Message.error({
                                    message: res.data.message,
                                    center: true
                                });
                                that.sendStatus = 0;
                                that.isMailDisabled = false;
                                that.mailClick = true;
                                return false;
                            }
                        }).catch(function (error) {
                            that.sendStatus = 0;
                            that.isMailDisabled = false;
                            that.mailClick = true;
                            that.catchError(error);
                        });
                    } else {
                        that.sendStatus = 0;
                        that.isMailDisabled = false;
                        that.mailClick = true;
                    }
                });
            },
            catchError: function (error) {
                if (error.response && error.response.status && error.response.status == '401') {
                    Cookies.set('uinfo', '');
                    this.$router.push('/');
                }
            },
            changePwd: function (formName) {
                var that = this;
                var pwdForm = that[formName];
                var reqData = {
                    'oldPassword': pwdForm.oldPwd,
                    'newPassword': pwdForm.newPwd,
                    'verifyPassword': pwdForm.confirmPwd
                };
                that.pwdClick = false;
                that.$refs[formName].validate((valid) => {
                    if (valid)  {
                        $axios.post('/api/user/change_pwd', reqData).then((res) => {
                            that.pwdClick = true;
                            if (res && res.data && !res.data.code) {
                                Message.success({
                                    message: "修改密码成功~",
                                    center: true,
                                    type: 'info'
                                });
                                let info = res.data.data || {};
                                that.$refs[formName].resetFields();
                                that.$store.commit('changeInfo', info);
                            } else {
                                Message.error({
                                    message: res.data.message,
                                    center: true
                                });
                                return false;
                            }
                        });
                    } else {
                        that.pwdClick = true;
                    }
                });
            }
        }
    }
</script>
<style type="text/css">
    .el-input-group__append {
        .timer-btn {
            width: 100px;
            text-align: center;
        }
    }
</style>