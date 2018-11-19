<template>
  <div class="editor">
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
      <button type="text" class="toolbar__button" data-action="ok" title="OK (Enter)" v-if="data.cropping"><span class="el-icon-ok"></span></button>
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
  import { Message } from 'element-ui';

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
      }
    },

    data () {
      return {
        canvasData: null,
        cropBoxData: null,
        croppedData: null,
        cropper: null
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
            previousUrl: data.url,
            url: cropper.getCroppedCanvas().toDataURL(data.type),
          });
          this.stop ();
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
        this.update({
          cropped: false,
          cropping: false,
          loaded: false,
          name: '',
          previousUrl: '',
          type: '',
          url: ''
        });
      },

      update (data) {
        Object.assign(this.data, data);
      },

      uploadImg: function () {
          const { cropper, data } = this;
          let that = this;
          let $Blob = data.url;
          let formData = new FormData();
          let type = data.type ? data.type.split('/')[1] : '';
          if (data.url.search('base64') < 0) {
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
        this.update({
            cropped: false,
            cropping: false,
            loaded: false,
            name: '',
            previousUrl: '',
            type: '',
            url: ''
        });
      },

      confirmUploadImg: function (formData) {
        var that = this;
        $axios.post('/api/imgs/upload', formData).then((res) => {
          if (res.data && res.data.data) {
            let data = res.data.data;
            for (let i = 0; i < data.length; i++) {
              let item = data[i];
              if (item.flag) {
                Message.success({
                  message: item.fileName + '上传成功！'
                })
                that.$emit('refresh', 1);
                // that.$parent.$parent.getImgList (1, 20);
              } else {
                Message.error({
                  message: res.data.message || item.fileName + '上传失败！'
                })
              }
              that.initUpload();
            }
          }
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
                message: '头像上传成功！'
              })
          } else {
              Message.error({
                message: res.data.message || '头像上传失败！'
              })
          }
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
      }
    },
    beforeDestroy () {
      this.stop();
    }
  };
</script>

<style scoped>
  .editor {
    height: 100%;
    position: relative;
  }

  .canvas {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;

    & > img {
      max-height: 100%;
      max-width: 100%;
    }
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
</style>