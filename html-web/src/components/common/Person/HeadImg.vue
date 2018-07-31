<template>
<div>
    <el-form  label-position="right" label-width="100px" :model="nickNameForm" ref="nickNameForm" :rules="nickRules">
        <el-form-item label="头像">
            <div class="head-img-wrapper" @mouseover="toggleShow(1)" @mouseleave="toggleShow(0)" v-if="headImg">
                <img class="head-img" :src="headImg">
                <div class="mask-wrapper animated fadeIn" ref="headImg" >
                    <img-upload style="margin-top:-10px" :data="data" :isEditHead="isEditHead"></img-upload>
                </div>
            </div>
            <div class="img-upload" v-if="!headImg">
                <img-upload :data="data" :isAddHead="isAddHead"></img-upload>
            </div>
        </el-form-item>
        <el-form-item label="昵称">
            <el-input disabled :value="orgNickName"
            >
            </el-input>
        </el-form-item>
        <el-form-item prop="newNickName" label="新昵称">
            <el-input placeholder="请输入新的昵称"
            v-model="nickNameForm.newNickName"
            minlength="6" maxlength="8"
            >
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button class="submit-btn" type="primary" :disabled="!canClick" @click="submitNickName('nickNameForm')">修改昵称</el-button>
        </el-form-item>
    </el-form>
    <el-dialog
    title="图片编辑"
    :visible.sync="data.loaded"
    width="50%"
    center
    >
        <img-edit ref="editor" :data="data" :isEditHead="isEditHead" :isAddHead="isAddHead"></img-edit>
    </el-dialog>
</div>
</template>
<script type="text/javascript">
    import ImgUpload from "../ImgUpload";
    import ImgEdit from "../ImgEdit";
    import $axios from 'axios'
    import { Message } from 'element-ui';
    export default {
        name: "HeadImg",
        components: {
            'img-upload': ImgUpload,
            'img-edit': ImgEdit,
        },
        data () {
            var validateNickName = (rule, value, callback) => {
                if ((value.length >= 3 && value.length <= 8) && value != '') {
                    this.canClick = true;
                    callback();
                } else {
                    callback(new Error('昵称的长度为3~8个字符'));
                }
            };
            var that = this;
            return {
                // headImg: that.$store.state.headImg,
                nickNameForm: {
                    newNickName: ''
                },
                nickRules: {
                    newNickName: [
                        {validator: validateNickName, trigger: 'change' }
                    ]
                },
                data: {
                    cropped: false,
                    cropping: false,
                    loaded: false,
                    name: '',
                    previousUrl: '',
                    type: '',
                    url: ''
                },
                isEditHead: true,
                isAddHead: true,
                canClick: true
            }
        },
        computed: {
            headImg () {
                return this.$store.state.headImg;
            },
            orgNickName () {
                return this.$store.state.nickname;
            }
        },
        methods: {
            toggleShow: function (index) {
                if (+index === 0) {
                    this.$refs['headImg'].style.display = "none";
                } else {
                    this.$refs['headImg'].style.display = "block";
                }
            },
            submitNickName: function (formName) {
                var that = this;
                var nickData = that[formName];
                var formData = new FormData();
                formData.append('nickname', nickData.newNickName);
                that.canClick = false;
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        $axios.post('/api/user/update_uinfo', formData).then((res) => {
                            that.canClick = true;
                            if (res && res.data && !res.data.code) {
                                let info = res.data.data || {};
                                that.$store.commit('changeInfo', info);
                                that.$refs[formName].resetFields();
                                Message.success({
                                    message: "修改昵称成功~",
                                    center: true,
                                    type: 'info'
                                });
                            } else {
                                 Message.error({
                                    message: res.data.message,
                                    center: true
                                });
                                return false;
                            }
                        });
                    }
                })
            }
        }

    }
</script>
<style type="text/css" scoped>
    .head-img-wrapper {
        position: relative;
        width: 150px;
        margin-right: 20px;
    }

    .head-img {
        margin-top: 10px;
        width: 150px;
        height: 150px;
    }

    .mask-wrapper {
        display: none;
        position: absolute;
        top: 10px;
        left: 0;
        bottom: 13px;
        right: 0;
        background: rgba(0, 0, 0, 0.5);
    }

    .mask {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
    }
</style>