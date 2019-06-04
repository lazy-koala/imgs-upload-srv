<template> 
    <div class="">
        <div class="imgage-wrapper" v-loading="loading"   @mouseover="toggleShow(data._id, 1)" @mouseleave="toggleShow(data._id, 0)">
            <img class="image" :src="data.url"  @load="hideLoading()" >
            <div class="mask-wrapper animated fadeIn" :ref="data._id">
                <div class="btn-wrapper">
                    <el-button type="text" title="编辑图片" class="button icon el-icon-edit" @click="zoomIn(data)"></el-button>
                    <el-button type="text" title="下载图片" class="button icon el-icon-download" @click="downLoadImg(data.url, data._id, data.suffix)"></el-button>
                    <el-button type="text" title="复制地址" class="button icon el-icon-fuzhi" @click="copyUrl(data.url)"></el-button>
                    <el-button type="text" title="删除图片" class="button icon el-icon-delete" @click="delBox(data._id)"></el-button>                    
                </div>
                <div class="time">{{dateFormat(data.createTime)}}</div>                    
            </div>
        </div>
        <div class="bottom" v-if="data.tags && data.tags.length > 0">                    
            <div class="tag" v-for="tag in data.tags" :key="tag">{{tag}}</div>
        </div>
            <!-- <el-button type="text" class="button" @click="copyUrl(data.url)">复制链接</el-button>
            <el-button type="text" class="button" @click="downLoadImg(data.url, data._id, data.suffix)">下载图片</el-button> -->

        <el-dialog
        title="提示"
        :visible.sync="showDel"
        width="40%"
        center>
            <span>是否确认删除该图片?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDel = false">取 消</el-button>
                <el-button v-loading="delLoading" type="primary" @click="deleteImg()" >确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑图片开始 -->
        <el-dialog
        :visible.sync="showZoomIn"
        width="45%"
        height="50%"
         title="图片编辑"
        center>
            <div class="zoomin-wrapper">
                <img :src="zoomInImg">
                <div class="sort">
                    <el-select v-model="selectedSort" filterable placeholder="请选择分类">
                        <el-option
                        v-for="item in sortList"
                        :key="item.sortId"
                        :label="item.sortName"
                        :value="item.sortId">
                        </el-option>
                    </el-select>
                </div>
                <div class="tag-list" v-if="tagList">
                    <el-tag
                        :key="tag"
                        v-for="tag in tagList"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>

                    <el-input
                        v-if="showTagInput"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        class="input-new-tag"
                        maxlength=6
                        minlength=3
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"                        
                        >
                    </el-input>
                    <el-button v-show="tagList.length < 3" v-else class="button-new-tag" size="small" @click="showInput">添加标签</el-button>
                </div>
                <div class="btn">
                    <el-button type="primary" @click="confirmEdit()">确认编辑</el-button>
                    <el-button type="primary" @click="cancelEdit()">取消</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 编辑图片结束 -->

    </div>
</template>
<script>
import Common from '../../assets/scripts/common.js';
import $axios from 'axios';
import { Message, Loading } from 'element-ui';

export default {
    name: 'ImgItem',
    props: {
        data: {
            type: Object
        },
        imgList: {
            type: Array
        }
    },
    data() {
         return {
            showDel: false,
            delId: '',
            showZoomIn: false,
            zoomInImg: '',
            loading: true,
            // tag相关数据
            tagList: [],
            showTagInput: false,
            inputValue: '',
            // 分类相关数据
            selectedSort: this.$props.data.sortId,
            sortList: this.$store.state.sortList,

            delLoading: false
         }
    },
    methods: {
        dateFormat: function (time) {
            return Common.formatTime(time);
        },
        toggleShow: function (id, index) {
            if (+index === 0) {
                this.$refs[id].style.display = "none";
            } else {
                this.$refs[id].style.display = "block";
            }
        },
        hideLoading (id) {            
            this.loading = false;
        },
        // 删除图片弹框
        delBox: function (id) {
            this.delId = id;
            this.showDel = true;
        },
        // 确认删除图片
        deleteImg: function () {
            this.delLoading = true;
            var that = this;
            $axios.post('/api/imgs/del', {ids: [that.delId]}).then((res) => {
                if (res.data) {
                    Message.success({
                        message: '删除成功',
                        type: 'info',
                        center: true
                    });
                    that.delLoading = false;
                    that.showDel = false;
                    this.$parent.$emit('refreshImgList', '1')
                }
            }).catch(function (error) {
                that.catchError(error);
            })
        },
        // 图片编辑弹框
        zoomIn: function (data) {
            this.zoomInImg = data.url;
            this.showZoomIn = true;
            this.tagList = [...data.tags] || [];
        },

        // 取消图片编辑
        cancelEdit: function () {
            this.showZoomIn = false;
        },

        // 确认编辑处理
        confirmEdit: function () {
            let params = {
                sortId: this.selectedSort,
                tags: this.tagList || [],
                imgId: this.data._id
            } 
            // 判断是否有修改
            let isChange = this.isChange(params);
            if(isChange) {
                $axios.post('/api/imgs/update', params).then((res) => {
                    if(!res.code) {
                        // 关闭弹框
                        this.showZoomIn = false;
                        Message.success({
                            message: '修改成功',
                            type: 'info',
                            center: true
                        });
                        // 刷新列表
                        this.$parent.$emit('refreshImgList', '1')
                    }
                })   
            } else {
                this.showZoomIn = false;
                Message.success({
                    message: '修改成功',
                    type: 'info',
                    center: true
                });                
            }
        },

        // 判断参数是否有修改
        isChange: function (params) {
            return params.sortId != this.data.sortId || JSON.stringify(params.tags) != JSON.stringify(this.data.tags);
        },

        handleClose(tag) {
            this.tagList && this.tagList.splice(this.tagList.indexOf(tag), 1);
        },

        showInput() {
            this.showTagInput = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
            this.tagList.push(inputValue);
            }
            this.showTagInput = false;
            this.inputValue = '';
        },

        // 复制图片地址
        copyUrl: function (url) {
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.setAttribute('value', url);
            input.setAttribute('display', "none");
            input.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                Message.success({
                    message: '已复制',
                    type: 'info',
                    center: true
                });
            }
            document.body.removeChild(input);
        },

        downLoadImg: function (url, id, suffix) {
            if (!url || !id) {
                Message.error({
                    message: '下载错误~',
                    type: 'error',
                    center: true
                });
                return false;
            };
            var index = this.findIndex(url, '/', 2);
            url = url.slice(index, url.length);
            var newDomain = window.location.protocol + "//" + window.location.host;
            // console.log(url);
            // var newDomain = "https://imgs.thankjava.com";
            var downLoadUrl = newDomain + '/' + url;
            var alink = document.createElement("a");
            var typeIndex = downLoadUrl.lastIndexOf(".");
            var ext = suffix;
            document.body.appendChild(alink);
            alink.style.display='none';
            alink.href = downLoadUrl;
            alink.download = id + '.' + ext;
            alink.click();
        },

        findIndex: function (str, cha, num) {
            var x = str.indexOf(cha);
            for (var i = 0; i < num; i++) {
                x = str.indexOf(cha, x + 1);
            }
            return x;
        },
        catchError: function (error) {
            if (error.response && error.response.status && error.response.status == '401') {
                Cookies.set('uinfo', '');
                this.$router.push('/');
            }
        }
    }
}
</script>
<style scoped>
    .list-item {
        position: relative;
        float: left;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 220px;
        height: 220px;
    }
        .imgage-wrapper {
        position: relative;
        text-align: center;
    }
    .image {
        width: 160px;
        height: 160px;
    }

    .mask-wrapper {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(13,10,49,.9);
    }

    .mask {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
    }

    .btn-wrapper {
        position: relative;
        overflow: hidden;
        margin: 10px auto;
    }

    .button {
        display: inline-block;
    } 
    .time {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        font-size: 12px;
        height: 20px;
        text-align: center;
        background: rgba(13, 10, 49, 1);
        color: #fff;
        line-height: 20px;
    }

    .icon {
        /*pointer-events: auto;*/
        padding: 15px;
        color: #fff;
        font-size: 32px;
    }

    .icon:hover{
        cursor: pointer;
        color: red;
        background: rgba(13, 10, 49, 1);
    }

    .el-button + .el-button {
        margin: 0;
    }

    .tag {
        text-align: center;
        font-size: 12px;
        line-height: 16px;
        color: #666;
    }

    
    .zoomin {
        width: 45%;
        height: 45%;
    }

    .zoomin-wrapper {
        width: 100%;
        height: 450px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        img {
            max-width: 100%;
            max-height: 100%;
        }

        .btn {
            margin-top: 20px;            
        }
    }
    .sort {
       margin-top: 20px; 
       margin-left: 0;
       width: 300px;
    }
    .tag-list {
        margin-top: 20px;
        .el-tag {
            margin-right: 10px;
        }
        .input-new-tag {
            width: 90px;
        }
    }
</style>