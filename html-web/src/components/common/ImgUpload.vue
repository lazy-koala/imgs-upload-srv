<template>
    <div>
        <div class="upload" @change="change" v-if="!isEditHead && !isAddHead">
            <i  class="el-icon-upload"></i>
            <input type="file" name="file" accept="image/jpeg,image/x-png,image/gif">
        </div>
        <div v-if="isEditHead" @change="change" class="head-icon">
            <i>点击修改头像</i>
            <input type="file" name="file" accept="image/jpeg,image/x-png,image/gif">
        </div>
        <div v-if="isAddHead" @change="change" class="head-icon edit">
            <i>点击上传头像</i>
            <input type="file" name="file" accept="image/jpeg,image/x-png,image/gif">
        </div>
    </div>
</template>
<script type="text/javascript">

    const URL = window.URL || window.webkitURL;

    export default {
        name: 'ImgUpload',
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
        methods: {
            upload (e) {
                let file = e.target.files[0];
                let type = file.type.split('/')[0];
                //按照惯例，不应该由前端判断格式，因为这里是根据后缀名判断的，修改后缀名仍旧可以上传，理应由后端根据文件格式来判断。
                if (type != 'image') {
                    alert('请上传图片');
                    return false;
                }
                var reader = new window.FileReader();
                reader.readAsDataURL(file);
                this.imgUrl = reader.result;//将图片读取为DataURL
                // this.$refs.imgTest.cropper({

                // });
                // var size = Math.round(file.size / 1024 / 1024);
                // if (size > 3) {
                //     alert('图片大小不得超过3M');
                //     return;
                // };
            },

            read (files) {
                return new Promise((resolve, reject) => {
                    if (!files || files.length === 0) {
                        resolve();
                        return;
                    }

                    const file = files[0];
                    if (/^image\/\w+$/.test(file.type)) {
                        if (URL) {
                            resolve({
                                loaded: true,
                                name: file.name,
                                type: file.type,
                                url: URL.createObjectURL(file)
                            });
                        } else {
                            reject(new Error('Your browser is not supported.'));
                        }
                    } else {
                        reject(new Error('Please choose an image file.'));
                    }
                });
            },

            change ({ target }) {
                this.read(target.files).then((data) => {
                    target.value = '';
                    this.update(data);
                }).catch((e) => {
                    target.value = '';
                    this.alert(e);
                });
            },

            alert (e) {
                window.alert(e && e.message ? e.message : e);
            },

            update (data) {
                Object.assign(this.data, data);
            }
        }
    }
</script>
<style type="text/css" scoped>
.upload {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px auto;
    width: 150px;
    height: 150px;
    color: #409EFF;
    font-size: 100px;
    flex-direction: column;
    border: 1.5px dashed;
    input {
        position: absolute;
        opacity: 0;
        width: 150px;
        height: 150px;
    }

    input:hover {
        cursor: pointer;
    }
}

.head-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px auto;
    width: 150px;
    height: 150px;
    color: #fff;
    font-size: 20px;
    flex-direction: column;
    input {
        position: absolute;
        opacity: 0;
        width: 150px;
        height: 150px;
    }
}
.edit {
    border: 1.5px dashed;
    color: #409EFF;
}

.head-icon:hover {
    cursor: pointer;
}
.upload:hover {
    cursor: pointer;
}

.head-icon {
    font-size: 20px;
}


</style>