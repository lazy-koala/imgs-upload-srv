<template>
  <div class="editor" ref="editor">
    <div class="canvas" @dblclick="dblclick">
      <img ref="image" :alt="data.name" :src="data.url" @load="start">
    </div>
    <div class="toolbar-wrapper" v-if="cropper" @click="click">
      <button type="text" class="toolbar__button" data-action="move" title="Move (M)"><span class="el-icon-move"></span></button>
      <button type="text" class="toolbar__button" data-action="crop" title="Crop (C)"><span class="el-icon-crop"></span></button>
      <button type="text" class="toolbar__button" data-action="zoom-in" title="Zoom In (I)" v-if="data.cropping"><span class="el-icon-zoomin"></span></button>
      <button type="text" class="toolbar__button" data-action="zoom-out" title="Zoom Out (O)" v-if="data.cropping"><span class="el-icon-zoom-out"></span></button>
      <button type="text" class="toolbar__button" data-action="rotate-left" title="Rotate Left (L)"><span class="el-icon-rotate-left"></span></button>
      <button type="text" class="toolbar__button" data-action="rotate-right" title="Rotate Right (R)"><span class="el-icon-rotate-right"></span></button>
      <button type="text" class="toolbar__button" data-action="remove" title="Delete (Delete)" v-if="data.loaded && !data.cropping"><span class="el-icon-delete-copy"></span></button>
      <button type="text" class="toolbar__button" data-action="restore" title="Undo (Ctrl + Z)" v-if="data.cropped"><span class="el-icon-undo"></span></button>
      <button type="text" class="toolbar__button" data-action="clear" title="Cancel (Esc)" v-if="data.cropping"><span class="el-icon-cancel"></span></button>
      <!-- <button type="text" class="toolbar__button" data-action="ok" title="OK (Enter)" v-if="data.cropping"><span class="el-icon-ok"></span></button> -->
    </div>
    <!-- <div class="tip-message">{{ `该图片将上传至"${tipMessage || '默认分类'}"分类` }}</div> -->
    <div class="tip-message" v-if="!isEditHead">{{ tipMessage }}</div>
    <div class="tag-list" v-if="tagList && !isEditHead">
        <el-tag
            :key="`${tag}`"
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
        <el-button type="primary" @click="uploadImg">确认</el-button>
        <el-button type="primary" @click="initUpload">取消</el-button>
    </div>
  </div>
</template>

<script>
  import Cropper from 'cropperjs';
  import $axios from 'axios'
  import { Message, Loading } from 'element-ui';

  export default {
    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
      isEditHead: {
        type: Boolean,
        default: function () {
            return false
        }
      },
      isAddHead: {
        type: Boolean,
        default: function () {
            return false
        }
      },
      sortId: {
          type: String,
          default: ''
      },
      sortList: {
        type: Array
      }
    },

    data () {
      return {
        canvasData: null,
        cropBoxData: null,
        croppedData: null,
        cropper: null,
        loading: null,
        tagList: [],
        inputValue: '',
        showTagInput: false,
        tipMessage: ''
      };
    },

    methods: {
      click ({ target }) {
        const { cropper } = this;
        const action = target.getAttribute('data-action') || target.parentElement.getAttribute('data-action');
        switch (action) {
          case 'move':
          case 'crop':
            cropper.setDragMode(action);
            break;

          case 'zoom-in':
            cropper.zoom(0.1);
            break;

          case 'zoom-out':
            cropper.zoom(-0.1);
            break;

          case 'rotate-left':
            cropper.rotate(-90);
            break;

          case 'rotate-right':
            cropper.rotate(90);
            break;

          case 'ok':
            this.crop();
            break;

          case 'clear':
            cropper.clear();
            break;

          case 'restore':
            cropper.restore();
            break;

          case 'remove':
            this.reset();
            break;
          default:
        }
      },

      dblclick (e) {
        if (e.target.className.indexOf('cropper-face') >= 0) {
          e.preventDefault();
          e.stopPropagation();
          this.crop();
        }
      },

      start () {
        const { data } = this;

        if (data.cropped) {
          return;
        }


        if (data.isGif) {
          return;
        }

        this.cropper = new Cropper(this.$refs.image, {
          autoCrop: false,
          dragMode: 'move',
          background: false,

          ready: () => {
            if (this.croppedData) {
              this.cropper
                .crop()
                .setData(this.croppedData)
                .setCanvasData(this.canvasData)
                .setCropBoxData(this.cropBoxData);

              this.croppedData = null;
              this.canvasData = null;
              this.cropBoxData = null;
            }
          },

          crop: ({ detail }) => {
            if (detail.width > 0 && detail.height > 0 && !data.cropping) {
              this.update({
                cropping: true,
              });
            }
          },
        });
      },

      stop () {
          this.update({
            cropped: false,
            cropping: false,
            loaded: false,
            name: '',
            previousUrl: '',
            type: '',
            url: '',
            isGif: false,
            base64Url: ''
          });
        if (this.cropper) {
          this.cropper.destroy();
          this.cropper = null;
        }
      },

      crop () {
        const { cropper, data } = this;

        if (data.cropping) {
          this.croppedData = cropper.getData();
          this.canvasData = cropper.getCanvasData();
          this.cropBoxData = cropper.getCropBoxData();
          this.update({
            cropped: true,
            cropping: false,
            loaded: true,
            previousUrl: data.url,
            url: cropper.getCroppedCanvas().toDataURL(data.type),
          });
          this.uploadImg();
          this.reset();
        }
      },

      clear () {
        if (this.data.cropping) {
          this.cropper.clear();
          this.update({
            cropping: false,
          });
        }
      },

      restore () {
        if (this.data.cropped) {
          this.update({
            cropped: false,
            previousUrl: '',
            url: this.data.previousUrl,
          });
        }
      },

      reset () {
        this.stop();
        // this.update({
        //   cropped: false,
        //   cropping: false,
        //   loaded: false,
        //   name: '',
        //   previousUrl: '',
        //   type: '',
        //   url: ''
        // });
      },

      update (data) {
        Object.assign(this.data, data);
      },

      uploadImg: function () {
          const { cropper, data } = this;
          let that = this;
          //show Loading
          that.loading = Loading.service({
                target: that.$refs.editor
          });
          let $Blob = data.isGif ? data.base64Url : data.url;
          let formData = new FormData();
          let type = data.type ? data.type.split('/')[1] : '';
          if (data.url.search('base64') < 0 && !data.isGif) {
            $Blob = cropper.getCroppedCanvas().toDataURL(data.type);
          }

          $Blob = window.btoa(unescape(encodeURIComponent($Blob)));
          let file = that.getBlobBydataURI($Blob);
          if (that.isEditHead || that.isAddHead) {
            formData.append('headImage', file, data.name);
            that.confirmHeadImg(formData);
          } else {
            formData.append('file', file, data.name);
            that.confirmUploadImg(formData);
          }
      },

      initUpload: function () {
        this.stop();
        // this.update({
        //     cropped: false,
        //     cropping: false,
        //     loaded: false,
        //     name: '',
        //     previousUrl: '',
        //     type: '',
        //     url: ''
        // });
      },

      confirmUploadImg: function (formData) {
        var that = this;
        let tags = that.tagList;
        let sortId = that.sortId;
        for (var i = 0; i < tags.length; i++) {
            formData.append('tags',tags[i]);
        }
        formData.append('sortId', sortId);
        $axios.post('/api/imgs/upload', formData).then((res) => {
          that.$nextTick(() => {
            if (that.loading) {
                that.loading.close();
            }
          })
          if (res.data && res.data.data) {
            let data = res.data.data;

            for (let i = 0; i < data.length; i++) {
              let item = data[i];
              if (item.flag) {
                Message.success({
                  message: item.fileName + '上传成功！',
                  center: true
                })
                that.$emit('refresh', 1);
                that.tagList = [];
                // that.$parent.$parent.getImgList (1, 20);
              } else {
                Message.error({
                  message: res.data.message || item.fileName + '上传失败！',
                  center: true
                })
              }
              that.initUpload();
            }
          }
        }).catch(function (error) {
          if (that.loading) {
              that.loading.close();
          }
          that.data.loaded = false;
          that.catchError(error);
        })
      },

      confirmHeadImg: function (formData) {
        var that = this;
        that.initUpload();
        $axios.post('/api/user/update_uinfo', formData).then((res) => {
          if (res.data && res.data.data) {
            let data = res.data.data;
            that.$store.commit('changeInfo', {"headImg": data.headImg});
            Message.success({
                message: '头像上传成功！',
                center: true
              })
          } else {
              Message.error({
                message: res.data.message || '头像上传失败！',
                center: true
              })
          }
        }).catch(function (error) {
          that.catchError(error);
        })
      },

      getBlobBydataURI: function (dataURI) {
          var tempStr = decodeURIComponent(escape(window.atob(dataURI)))
          var byteString = tempStr.split(',')[1];
          // decodeURIComponent(atob(dataURI.split(',')[1]));

          var mimeString = tempStr.split(',')[0].split(':')[1].split(';')[0];
          var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
          // write the bytes of the string to a typed array
          var ia = new Uint8Array(arrayBuffer);
          for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }

          return new Blob([ia], {type: mimeString});
      },

      // 标签相关方法
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
            if (inputValue && this.tagList.findIndex((value) => value == inputValue) < 0) {
                this.tagList.push(inputValue);
                this.showTagInput = false;
                this.inputValue = '';
            }
            
      },
      updateSortName() {
        let msg = "";
        this.sortList.forEach(item => {
          if(item.sortId == this.sortId) {
            msg =  item.sortName + '';
          }
        });
        this.tipMessage =  `该图片将上传至"${msg || '默认分类'}"分类`;
        // this.$store.dispatch('getSortList', {
        //     sortId: '',
        //     sortName: '',
        //     type: 'get'
        // }).then((res) => {
        //     let msg = '';
        //     this.sortList = [...res] || [];
        //     // console.log('watchwatchwatch', this.sortId);
        //     this.sortList.forEach(item => {
        //       if(item.sortId == this.sortId) {
        //         msg =  item.sortName + '';
        //       }
        //     });
        //     this.tipMessage =  `该图片将上传至"${msg || '默认分类'}"分类`;
        // })
      }
    },
    // watch: {
    //   sortId () {
        
    //   }
    // },
    mounted() {
      if(!this.isEditHead) {
        this.updateSortName()
      }
      
    },
    beforeUpdate() {
      if(!this.isEditHead) {
        this.updateSortName()
      }
    },
    beforeDestroy () {
      this.stop();
    },
  };
</script>

<style scoped>
  .editor {
    height: 50%;
    position: relative;
  }

  .canvas {
    align-items: center;
    display: flex;
    height: 300px;
    justify-content: center;
  }
  .canvas >img {
    width: auto;
    height: auto;
    max-height: 260px;
    max-width: 300px;
  }

  .toolbar-wrapper, .cropper-wrapper {
    background-color: rgba(0, 0, 0, .5);
    bottom: 1rem;
    color: #fff;
    height: 2rem;
    line-height: 2rem;
    margin: 1rem auto;
    width: 16rem;
    z-index: 2015;
    text-align: center;
  }

  .cropper-wrapper {
    text-align: center;
    width: 6rem;
  }

  .toolbar__button {
    background-color: transparent;
    border-width: 0;
    color: #fff;
    cursor: pointer;
    font-size: .875rem;

    &:focus {
      outline: none;
    }

    &:hover {
      background-color: #0074d9;
      color: #fff;
    }
  }
  .btn {
    text-align: center;
    margin-top: 10px;
  }
  .tip-message {
    text-align: center;
    color: red;
    margin-bottom: 5px;
  }
  .tag-list {
      text-align: center;
  }
  .input-new-tag {
      width: 200px;
  }
  .el-tag {
      margin-right: 5px;
  }
</style>
