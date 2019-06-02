<template> 
    <div class="">
        <div class="imgage-wrapper" v-loading="loading"   @mouseover="toggleShow(data._id, 1)" @mouseleave="toggleShow(data._id, 0)">
            <img class="image" :src="data.url"  @load="hideLoading()" >
            <div class="mask-wrapper animated fadeIn" :ref="data._id">
                <div class="mask">
                    <el-button type="text" class="button icon el-icon-delete" @click="delBox(data._id)"></el-button>
                    <el-button type="text" class="button icon el-icon-zoom-in" @click="zoomIn(data.url)"></el-button>
                </div>
                <div class="time">{{dateFormat(data.createTime)}}</div>
            </div>
        </div>
        <div class="bottom">
            <el-button type="text" class="button" @click="copyUrl(data.url)">复制链接</el-button>
            <el-button type="text" class="button" @click="downLoadImg(data.url, data._id, data.suffix)">下载图片</el-button>
        </div>       

        <el-dialog
        title="提示"
        :visible.sync="showDel"
        width="40%"
        center>
            <span>是否确认删除该图片?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDel = false">取 消</el-button>
                <el-button type="primary" @click="deleteImg()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        :visible.sync="showZoomIn"
        width="45%"
        height="50%"
        center>
            <!-- <img :src="zoomInImg"> -->
            <div class="zoomin-wrapper">
                <img :src="zoomInImg">
            </div>
        </el-dialog>
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
            loading: true     
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
            var that = this;
            $axios.post('/api/imgs/del', {ids: [that.delId]}).then((res) => {
                if (res.data) {
                    Message.success({
                        message: res.data.message || '删除成功',
                        type: 'info',
                        center: true
                    });
                    that.showDel = false;
                    that.getImgList(1);
                }
            }).catch(function (error) {
                that.catchError(error);
            })
        },

        zoomIn: function (url) {
            this.zoomInImg = url;
            this.showZoomIn = true;
        },

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
    },
    beforeMount () {
        // console.log('mount');
        // let imgList = this.imgList || [];
        // for (var i = 0; i < imgList.length; i++) {
        //     let item = imgList[i];
        //     this.loadingStatus[item._id] = true;            
        // }
    },
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
        width: 200px;
        height: 210px;
    }
        .imgage-wrapper {
        position: relative;
    }
    .image {
        width: 150px;
        height: 150px;
    }

    .mask-wrapper {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 2px;
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

    .time {
        width: 100%;
        font-size: 12px;
        height: 20px;
        text-align: center;
        background: #409EFF;
        color: #fff;
        margin-top: -20px;
        line-height: 20px;
    }

    .icon {
        /*pointer-events: auto;*/
        padding: 10px;
        color: #fff;
        font-size: 32px;
    }

    .icon:hover{
        cursor: pointer;
    }
</style>