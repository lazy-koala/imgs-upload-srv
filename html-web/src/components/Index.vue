<template>
    <div class="wrapper">
        <template>
            <common-header isIndex="0"></common-header>
        </template>
        <div class="list-wrapper">
            <div class="scroll-wrapper">
                <div class="list" ref="list">
                    <div class="list-item">
                        <img-upload :data="data"></img-upload>
                        <div class="bottom">
                            <el-button type="text" class="button"></el-button>
                            <el-button type="text" class="button"></el-button>
                        </div>
                    </div>
                    <div class="list-item" v-if="imgList.length > 0" v-for="item in imgList">
                        <div class="imgage-wrapper" :id="item._id + '-loading'" :ref="item._id + '-loading'"  @mouseover="toggleShow(item._id, 1)" @mouseleave="toggleShow(item._id, 0)">
                            <img class="image" :src="item.url" @load="hideLoading(item._id)">
                            <div class="mask-wrapper animated fadeIn" :ref="item._id">
                                <div class="mask">
                                    <el-button type="text" class="button icon el-icon-delete" @click="delBox(item._id)"></el-button>
                                    <el-button type="text" class="button icon el-icon-zoom-in" @click="zoomIn(item.url)"></el-button>
                                </div>
                                <div class="time">{{dateFormat(item.createTime)}}</div>
                            </div>
                        </div>
                        <div class="bottom">
                            <el-button type="text" class="button" @click="copyUrl(item.url)">复制链接</el-button>
                            <el-button type="text" class="button" @click="downLoadImg(item.url, item._id, item.suffix)">下载图片</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pagation" v-show="imgList.length > 0">
                <el-pagination
                    layout="total, prev, pager, next"
                    :total="page.totalCount"
                    :page-size='page.pageSize'
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                >
                </el-pagination>
            </div>
        </div>
        <template>
            <common-footer></common-footer>
        </template>
        <el-dialog
        title="图片编辑"
        :visible.sync="data.loaded"
        width="45%"
        center
        :before-close="handleClose"
        >
            <img-edit @refresh="getImgList" ref="editor" :data="data"></img-edit>
        </el-dialog>
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
<script type="text/javascript">
import CommonHeader from "./common/CommonHeader";
import CommonFooter from "./common/CommonFooter";
import ImgUpload from "./common/ImgUpload";
import ImgEdit from "./common/ImgEdit";
import $axios from 'axios';
import { Message, Loading } from 'element-ui';
import Common from '../assets/scripts/common.js';
import Cookies from "js-cookie";
export default {
    name: 'Index',
    data () {
        return {
            data: {
                cropped: false,
                cropping: false,
                loaded: false,
                name: '',
                previousUrl: '',
                type: '',
                url: '',
                isGif: false,
                base64Url: ''
            },
            page: {
                pageNumber: 1,
                pageSize: this.pageSize || this.defaultPageSize,
                pageCount: 0,
                currentPage: 1,
                totalCount: 0
            },
            imgList: [],
            nickName: '',
            showDel: false,
            delId: '',
            showZoomIn: false,
            zoomInImg: '',
            defaultPageSize: 14,
            pageSize: 14,
            loadingArr: {}
        }
    },
    components: {
        'img-upload': ImgUpload,
        'img-edit': ImgEdit,
        'common-header': CommonHeader,
        'common-footer': CommonFooter
    },
    methods: {
        getImgList: function (num) {
            var that = this;
            var ref = that.$refs['list'];
            var clientWidth = +document.body.clientWidth;
            var clientHeight = +ref.offsetHeight;
            var picWidth = 200;
            var picHeight =210;
            var size = +parseInt(clientWidth/picWidth) * (+parseInt(clientHeight/picHeight)) - 1;
            that.pageSize = size;
            var params = {
              pageSize: size,
              pageNumber: num
            };
            // console.log(reqData);
            $axios.get('/api/imgs/list', {params}).then((res) => {
              if (res.data.data) {
                var data = res.data.data;
                that.imgList = data.list || [];
                var imgList = that.imgList;

                setTimeout(function () {
                    for (var i = 0; i < imgList.length; i++) {
                        var item = imgList[i];
                        that.loadingArr[item._id] = Loading.service({
                            target: that.$refs[item._id + '-loading'][0],
                            lock: true,
                            fullscreen: false
                        });
                    }
                }, 0)

                // loading.close();
                that.update({
                    pageCount: data.pageCount,
                    currentPage: num,
                    totalCount: data.totalCount,
                    pageSize: size
                });
              }
            }).catch(function (error) {
                that.catchError(error);
            })
        },
        hideLoading (id) {
            this.$nextTick(() => {
                if (this.loadingArr[id]) {
                    this.loadingArr[id].close();
                }
            })
        },
        update (data) {
            Object.assign(this.page, data);
        },
        handleSizeChange: function (val) {
            this.update({
                pageSize: this.page.pageSize || this.defaultPageSize
            });
        },

        handleCurrentChange: function (val) {
            this.getImgList(val);
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

        delBox: function (id) {
            this.delId = id;
            this.showDel = true;
        },

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

        dateFormat: function (time) {
            return Common.formatTime(time);
        },

        catchError: function (error) {
            if (error.response && error.response.status && error.response.status == '401') {
                Cookies.set('uinfo', '');
                this.$router.push('/');
            }
        },

        toggleShow: function (id, index) {
            if (+index === 0) {
                this.$refs[id][0].style.display = "none";
            } else {
                this.$refs[id][0].style.display = "block";
            }
        },

        handleClose: function (done) {
            this.$refs.editor.stop();
        }
    },
    mounted () {
        var that = this;
        let uinfo = Cookies.get('uinfo') || '';
        if (!uinfo || uinfo == '') {
            that.$router.push('/');
            return false;
        }
        that.getImgList(this.page.pageNumber);
        $axios.get('/api/user/uinfo').then((res) => {
            if (res.data && res.data.data) {
                var info = res.data.data || {};
                that.$store.commit('changeInfo', info);
            }
        }).catch(function (error) {
            that.catchError(error);
        })

    }
}
</script>
<style type="text/css">
    .wrapper {
        position: relative;
        height: 100%;
    }
    .list-wrapper {
        position: absolute;
        top: 80px;
        bottom: 80px;
        left: 0px;
        right: 0px;
    }
    .scroll-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        overflow:hidden;
        margin: 0 auto;
        overflow: hidden;
    }
    .list {
        position: absolute;
        top: 0;
        right: 0px;
        left: 0px;
        width: 100%;
        bottom: 40px;
        margin: 10px auto;
        overflow-y: scroll;
        padding: 0 20px;
    }

    .list::-webkit-scrollbar {
        display: none;
    }

    .pagation {
        position: absolute;
        bottom: 5px;
        width:100%;
        text-align: center;
    }

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
    .eidt-wrapper {
        position: fixed;
        background: rgba(0, 0, 0, 0.5);
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    .download {
        display: none;
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
        align-items: center;
        img {
            max-width: 100%;
            max-height: 100%;
        }
    }
</style>