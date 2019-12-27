<template>
    <div>
        <common-header isIndex="2" :shareUser="shareUser"></common-header>
        <div class="wrapper">
            <div class="imgage-wrapper" v-loading="loading" v-for="item in sharedUrls" :key="item"   @mouseover="toggleShow(item, 1)" @mouseleave="toggleShow(item, 0)">
                <img class="image" :src="item"  @load="hideLoading()" >
                <div class="mask-wrapper animated fadeIn" :ref="item">
                    <div class="btn-wrapper">
                        <el-button type="text" title="复制地址" class="button icon el-icon-fuzhi" @click="copyUrl(item)"></el-button>
                        <el-button type="text" title="点击放大" class="button icon el-icon-zoom-in" @click="showModal(item)"></el-button>
                    </div>
                </div>
            </div>
        </div>
        
         <template class='footer'>
            <common-footer></common-footer>
        </template>

        <el-dialog
        title="图片"
        :visible="showLarge"
        width="45%"
        center
        :before-close="handleClose"
        >
            <div class="img-wrapper">
                <img :src="selectedUrl" alt="">
                <p style="text-align: center">
                    <el-button type="text" title="查看原图" @click="showOrigin()">查看原图</el-button>
                </p>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import $axios from 'axios';
import CommonHeader from "./common/CommonHeader";
import CommonFooter from "./common/CommonFooter";
import Common from '../assets/scripts/common.js';
import { Message, Loading } from 'element-ui';

export default {
    name: 'share',
    components: {
        'common-header': CommonHeader,
        'common-footer': CommonFooter,
    },
    data() {
        return {
            shareId: '',
            sharedUrls: [],
            loading: false,
            selectedUrl: '',
            showLarge: false,
            shareUser: ''
        }
    },
    mounted() {
        this.shareId = this.$route.query.shareId || '';
        this.getUrls();

    },
    methods:{
        getUrls() {
            let params = {
                shareId: this.shareId
            };
            $axios.get('/api/share/query', {params}).then((res) => {
                if(res.data.code) {
                     Message.error({
                        message: res.data.message || '网络异常，请稍后重试~',
                        center: true
                    });
                    return false;
                }
                if (res.data) {
                    this.sharedUrls = res.data.data && res.data.data.sharedUrls || [];
                    this.shareUser = res.data.data && res.data.data.shareUser; 
                } 
            })
        },
         toggleShow: function (id, index) {
            if (+index === 0) {
                this.$refs[id][0].style.display = "none";
            } else {
                this.$refs[id][0].style.display = "block";
            }
        },
        hideLoading (id) {            
            this.loading = false;
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
                    message: '图片链接已复制～',
                    type: 'info',
                    center: true
                });
            }
            document.body.removeChild(input);
        },
        // 放大图片
        showModal: function(url) {
            this.showLarge = true;
            this.selectedUrl = url;
        },

        handleClose: function() {
            this.showLarge = false;
            this.selectedUrl = '';
        },

        showOrigin:function() {
            let url = this.selectedUrl;
            this.showLarge = false;
            this.selectedUrl = '';
            window.open(url, "_blank"); 
        }
    }
}
</script>
<style scoped>
    .wrapper {
        position: relative;
        /* float: left;        
        margin: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center; */
        overflow: hidden;
    }
    .imgage-wrapper {
        width: 160px;
        height: 160px;
        position: relative;
        text-align: center;
        display: flex;
        align-items: center;
        float: left;        
        margin: 20px;
    }
    .image {
        max-width: 160px;
        max-height: 160px;
        width: auto;
        height: auto;
        /* height: 160px; */
    }

    .mask-wrapper {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0,0,0,.5);
        /* background: rgba(13,10,49,.9); */
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
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .button {
        display: inline-block;
    } 
  

    .icon {
        /*pointer-events: auto;*/
        padding: 8%;
        color: #fff;
        font-size: 32px;
    }

    .icon:hover{
        cursor: pointer;
        /* color: red; */
        color: #409eff;
        background: rgba(0,0,0,.3);
        /* background: rgba(13, 10, 49, 1); */
    }

    .el-button + .el-button {
        margin: 0;
    }

    .img-wrapper {
        max-width: 400px;
        max-height: 420px;
        width: 100%;
        height: 100%;
        margin: 0 auto;
    }
    .img-wrapper > img {
        max-width: 400px;
        max-height: 400px;
        width: 100%;
        height: 100%;
    }

    


</style>