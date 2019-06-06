<template>
    <div class="find-wrapper">
        <el-steps :active="active" finish-status="success" simple center>
            <el-step title="发送验证码"></el-step>
            <el-step title="重置密码"></el-step>
        </el-steps>
        <el-form v-show="active==0" class="form-wrapper" label-position="right" label-width="120px" :model="getCodeForm" ref="getCodeForm" :rules="codeRules">
            <!-- <el-form-item prop="username" label="用户名">
                <el-input
                    placeholder="请输入用户名"
                    v-model="getCodeForm.username"
                    :disabled="isDisable"
                    >
                </el-input>
            </el-form-item> -->
            <el-form-item prop="usrPwd" label="用户名或邮箱">
                <el-input type="mail" placeholder="请输入用户名或邮箱地址" v-model="getCodeForm.usrPwd" :disabled="isDisable">
                    <el-button slot="append" class="timer-btn" type="text" @click="beginTimer('getCodeForm')" v-if="sendStatus==0">获取验证码</el-button>
                    <el-button slot="append" class="timer-btn" type="text" v-if="sendStatus==1">发送中</el-button>

                    <el-button slot="append" class="timer-btn" type="text" v-if="sendStatus==2">{{timer}}s</el-button>
                </el-input>
            </el-form-item>
            <!-- <div class="btn-wrapper">
                <el-button type="primary" :disabled="!canClick" @click="nextStep('getCodeForm')">下一步</el-button>
            </div> -->
        </el-form>

        <el-form v-show="active==1" :model="resetForm" class="form-wrapper" label-position="right" label-width="100px" ref="resetForm" :rules="resetRules">
            <el-form-item prop="mailCode" label="邮箱验证码">
                <el-input type="text" placeholder="请输入邮箱验证码" v-model="resetForm.mailCode">
                </el-input>
            </el-form-item>
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
            // 验证用户名或者邮箱格式
            let validateUsrPwd = (rule, value, callback) => {

                // 先判断是否是邮箱地址
                let mailReg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
                if(mailReg.test(value)) {
                    this.inputType = 'mail';
                     callback();
                } else {
                    // 若不是邮箱则默认为用户名，按照用户名的校验规则
                    let userReg = new RegExp(/^[a-zA-Z0-9_-]{4,16}$/);
                    userReg.test(value) ? callback() : callback(new Error('用户名为数字或者字母，长度为4~16个字符'));
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
                    usrPwd: '',
                },
                resetForm: {
                    pwd: '',
                    checkPwd: '',
                    mailCode: ''
                },
                codeRules: {
                    usrPwd: [
                        {required: true, message: '用户名或邮箱不能为空', trigger: 'change'},
                        {validator: validateUsrPwd, trigger: 'blur'}
                    ]                    
                },
                resetRules: {
                    mailCode: [
                        {required: true, message: '邮箱验证码不能为空', trigger: 'change'},
                        {validator: validateCode, trigger: 'change' }
                    ],
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
                totalTime: 30,
                timer: this.totalTime,
                token: '',
                interval: null,
                isDisable: false,
                canClick: false, //下一步是否可点击
                active: 0,
                // 输入的是邮箱或者用户名的记录： username是用户名 mail是邮箱
                inputType: 'username'
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
                if (this.sendStatus != 0) {
                    return false;
                }

                this.$refs[formName].validateField('usrPwd', (valid) => {
                    valid1 = valid;
                });

                // this.$refs[formName].validateField('username', (valid) => {
                //     valid2 = valid;
                // });

                if (valid1) {
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
                var usrPwd = data.usrPwd || '';
                $axios.post('/api/forget_pwd', {
                    [that.inputType]: usrPwd.replace(/\s/g, '')
                }).then((res) => {
                    if (res && res.data && !res.data.code) {
                        this.sendStatus = 2;
                        this.isDisable = true;
                        this.canClick = true;
                        this.timer = this.totalTime;
                        this.interval ? clearInterval(this.interval) : '';
                        this.interval = setInterval(this.timerHandle, 1000);
                        that.token = res.data.data.token;                        
                        // 获取成功，跳转下一步
                        that.active = 1;
                        Message.success({
                            message: "验证码已发送，请查收邮件",
                            center: true,
                            type: 'info',
                            customClass: 'errtips'
                        });
                    } else {
                        that.isDisable = false;
                        that.canClick = false;
                        that.sendStatus = 0;
                        Message.error({
                            message: res.data.message,
                            center: true,
                            customClass: 'errtips'
                        });
                        return false;
                    }
                }).catch((err) => {
                    Message.error({
                        message: err.message,
                        center: true,
                        type: 'error',
                        customClass: 'errtips'
                    });
                    that.isDisable = false;
                    that.canClick = true;
                    that.sendStatus = 0;

                    // 获取成功，跳转下一步
                        that.active = 1;
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
            // nextStep: function (formName) {
            //     var that = this;
            //     var regData = that.regForm;
            //     that.$refs[formName].validate((valid) => {
            //         that.active = 1;
            //     });
            // },
            goBack: function () {
                this.active = 0;
            },
            cofirmReset: function (formName) {
                var that = this;
                var reqData = {
                    "token": that.token,
                    "password": that.resetForm.pwd,
                    "mailCode": that.resetForm.mailCode
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
            },

            // 清空输入内容
            restForm: function () {
                 this.$refs['getCodeForm'].resetFields();
                 this.$refs['resetForm'].resetFields();
                //  重置到第一步
                 this.active = 0;

                //  重置定时器和点击状态
                this.sendStatus = 0;
                this.isDisable = false;
                this.canClick = true;
                this.interval ? clearInterval(this.interval) : '';
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
    .errtips {
        z-index: 999;
    }
</style>