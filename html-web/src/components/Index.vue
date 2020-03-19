<template>
    <div class="wrapper">
        <template>
            <common-header isIndex="0"></common-header>
        </template>        
        <div class="list-wrapper" v-loading="globalLoading"> 
            <div class="sort">
                <search :sortList="sortList" :defaultSortId="defaultSortId" @handleSearch="searchHandler" :tag="tag"></search>                
            </div>           
            <div class="scroll-wrapper">
                <div class="list" ref="list">
                    <div class="list-item">
                        <img-upload :data="data"></img-upload>
                        <div class="bottom ">
                            <el-button type="text" class="button"></el-button>
                            <el-button type="text" class="button"></el-button>
                        </div>
                    </div>
                    <div class="list-item" :key="item._id" v-for="item in imgList">
                        <img-item :sortList="sortList" @handleSearch="searchHandler" :data="item"></img-item>
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
        title="图片裁剪"
        v-if="data.loaded"
        :visible.sync="data.loaded"
        width="45%"
        center
        :before-close="handleClose"
        >
            <img-edit :sortList="sortList" @refresh="getImgList" ref="editor" :data="data" :sortId="sortId"></img-edit>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
import CommonHeader from "./common/CommonHeader";
import CommonFooter from "./common/CommonFooter";
import ImgUpload from "./common/ImgUpload";
import ImgEdit from "./common/ImgEdit";
import ImgItem from './common/ImgItem';
import $axios from 'axios';
import Cookies from "js-cookie";
import Search from './common/Search';
import { Message, Loading } from 'element-ui';
import Common from '../assets/scripts/common.js';
import qs from 'qs';

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
                base64Url: '',   
            },
            page: {
                pageNumber: 1,
                pageSize: this.pageSize || this.defaultPageSize,
                pageCount: 0,
                currentPage: 1,
                totalCount: 0
            },
            sortId: '',
            sortName: '默认分类',
            tag: [],
            imgList: [],
            nickName: '',            
            defaultPageSize: 14,
            pageSize: 14,
            globalLoading: true,
            sortList: [],
            defaultSortId: "" //默认加载的分类id
        }
    },
    components: {
        'img-upload': ImgUpload,
        'img-edit': ImgEdit,
        'common-header': CommonHeader,
        'common-footer': CommonFooter,
        'search': Search,
        'img-item': ImgItem
    },
    methods: {
        getImgList: function (num) {
            var that = this;
            var ref = that.$refs['list'];
            var clientWidth = +document.body.clientWidth;
            var clientHeight = +ref.offsetHeight;
            var picWidth = 180;
            var picHeight =210;
            // var size = +parseInt(clientWidth/picWidth) * (+parseInt(clientHeight/picHeight)) - 4;
            var size = +parseInt((clientWidth - 20) /picWidth) * (+parseInt(clientHeight/picHeight)) - 1;            
            that.pageSize = size > 0 ? size : 10;
            var params = {
              pageSize: size > 0 ? size : 1,
              pageNumber: num,
              sortId: that.sortId,
              tag: that.tag
            };
            that.globalLoading = true;
            
            $axios.get('/api/imgs/list', {
                params: params,
                paramsSerializer: params => {
                return qs.stringify(params, { indices: false })
            }}).then((res) => {    
                that.globalLoading = false;            
                if (res.data.data) {
                    var data = res.data.data;
                    that.imgList = data.list || [];
                    var imgList = that.imgList;
                    // loading.close();
                    that.update({
                        pageCount: data.pageCount,
                        currentPage: num,
                        totalCount: data.totalCount,
                        pageSize: size
                    });
                }
            }).catch(function (error) {
                that.globalLoading = false; 
                that.catchError(error);
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
            // console.log(val);
            this.getImgList(val);
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
        },
        // search组件点击搜索触发的事件
        searchHandler: function (search) {
            // todo 获取图片列表传参修改
            // 修改请求参数
            // console.log('selectchange', search);
            this.sortId = search.sortId || '';
            this.tag = [...search.tag];
            this.getImgList(1);
        },
        getSortList() {
            let params = {
                sortName: '',
                sortId: ''
            };
            $axios.get('/api/sort/list', {params}).then((res) => {
                if (res.data) {
                    this.sortList = res.data && res.data.data && res.data.data.list || [];
                    this.defaultSortId = res.data && res.data.data && res.data.data.defaultLoadSortId || '';
                    this.sortId = this.defaultSortId;
                    this.getImgList(this.page.pageNumber);
                }
            })
        }
    },
    mounted () {
        var that = this;
        let uinfo = Cookies.get('uinfo') || '';
        if (!uinfo || uinfo == '') {
            that.$router.push('/');
            return false;
        }
        
        $axios.get('/api/user/uinfo').then((res) => {
            if (res.data && res.data.data) {
                var info = res.data.data || {};
                that.$store.commit('changeInfo', info);
            }
        }).catch(function (error) {
            that.catchError(error);
        })
        // this.$refs.saveTagInput.$refs.input.focus();
    },
    created() {
        this.$on('refreshImgList', (num) => {
            this.getImgList(num);
        });

        this.getSortList()
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
        bottom: 40px;
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
        overflow: hidden;
        /* overflow-y: scroll; */
        padding: 0 20px;
    }
    .sort {
        margin-left: 20px;
        .el-select {
            width: 90%;
        }
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
        margin-right: 20px;
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
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
</style>