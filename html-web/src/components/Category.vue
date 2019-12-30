<template>
    <div>
        <template>
            <common-header isIndex="1"></common-header>
        </template>
        <div class="content-wrapper">
            <div class="category-list">
                <header style="display: flex;">
                    <h3>分类列表</h3>
                    <el-button size="small" type="primary" class="add-btn" @click="popAddBox('add')">新增分类</el-button>
                </header>
                
                <!-- 分类列表 -->
                <el-table
                    v-loading="tableLoading"
                    :data="tableData"
                    border
                    style="width: 100%">   
                    <el-table-column
                    prop="createTime"
                    label="创建时间">
                        <template slot-scope="scope">
                            {{timeFormat(scope.row.createTime)}}
                        </template>
                    </el-table-column>

                    <el-table-column
                    prop="sortName"
                    label="分类名称">
                    </el-table-column>
                    
                    <el-table-column
                    label="操作"
                    width="250">
                    <template slot-scope="scope">
                        <el-button v-show="scope.row.sortName != '默认分类'" @click="popDelBox(scope.row)" type="text" size="small">删除</el-button>
                        <el-button v-show="scope.row.sortName != '默认分类'" type="text" size="small" @click="popAddBox('edit', scope.row)">编辑</el-button>
                        <el-button type="text" v-show="!scope.row.shareId && scope.row.sortName != '默认分类'" size="small" @click="popShareBox(scope.row, 'share')">分享该分类</el-button>
                        <el-button type="text" v-show="scope.row.shareId" size="small" @click="popShareBox(scope.row, 'cancel')">取消分享</el-button>
                        <el-button type="text" v-show="scope.row.shareId" size="small" @click="popShareBox(scope.row, 'copy')">复制分享链接</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="category-manage">
                <header>
                    <h3>分类管理</h3>
                    <small>点击分类设置为默认加载的分类</small>
                </header>
                <el-radio-group v-model="selecetedId" @change="changeDefault">
                    <el-radio class="radio-button" v-for="item in setTableData" :label="item.sortId" :key="item.sortId" border>{{item.sortName}}</el-radio>
                </el-radio-group>

            </div>
            <!-- 删除分类 -->
            <el-dialog
                :visible.sync="delBox"
                :before-close="handleDelCancel"
                title="删除分类"
                width="50%">
                <p class="title">删除分类后该分类下的图片将自动归类到“默认分类”中</p>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleDelCancel">取 消</el-button>
                    <el-button type="primary" @click="handleDel">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 新增、编辑分类弹框 -->
            <el-dialog
                :visible.sync="dialogVisible"
                :before-close="handleCancel"
                width="50%">
                <div slot="title">{{title}}</div>
                <el-input maxlength=6 minlength=1 v-model="sortName" placeholder="请输入分类名称"></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel">取 消</el-button>
                    <el-button type="primary" @click="handleSort">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 分享弹框 -->
            <el-dialog
                :visible.sync="shareBox"
                :before-close="handleShareCancel"
                width="60%">
                <div slot="title">分享成功</div>
                <el-input v-model="shareLink" disabled>
                    <el-button slot="append" type="primary" @click="copyLink">复制链接</el-button> 
                </el-input>  
                <p class="tips">温馨提示：该链接仅分享该分类当前包含的所有图片，后续上传至该分类的图片不会被自动分享</p>          
            </el-dialog>

            
        </div>
        <template class='footer'>
            <common-footer></common-footer>
        </template>
    </div>
</template>
<script>
import CommonHeader from "./common/CommonHeader";
import CommonFooter from "./common/CommonFooter";
import Cookies from "js-cookie";
import $axios from 'axios';
import { Message, Loading } from 'element-ui';
import Common from "../assets/scripts/common.js";

export default {
    name: 'category',
    components: {
        'common-header': CommonHeader,
        'common-footer': CommonFooter,
    },
    data() {
        return {
            tableData: [],
            setTableData: [],
            dialogVisible: false,
            sortName: '',
            handleType: '', //操作分类的类型 'add'新增分类 'edit'编辑分类
            title: '',
            delBox: false,
            delData: {},
            tableLoading: true,
            // 分享相关变量
            shareBox: false, //分享弹框显示
            shareLink: {}, //分享链接
            selecetedId: "" //默认加载的分类ID
        }
    },
    methods: { 
        //新增/编辑分类
        handleSort: function () {
            let that = this;
            let handleType = this.handleType;
            let sortName = (this.sortName || '').replace(/\s/g, '');
            if(sortName && handleType == 'add') {
                $axios.post('/api/sort/add', { sortName: sortName }).then((res) => {
                    // 提示成功
                    Message.success({
                        message: '添加分类成功',
                        type: 'info',
                        center: true
                    });
                    // 添加成功，刷新列表
                    that.getSortList('update');
                    
                    // 关闭弹框
                    that.dialogVisible = false;
                    // 清楚输入框内容
                    that.sortName == ''
                })
            }

            if(sortName && handleType == 'edit') {
                $axios.post('/api/sort/update', { sortName: sortName, sortId: that.sortId }).then((res) => {
                    // 提示成功
                    Message.success({
                        message: '修改分类成功',
                        type: 'info',
                        center: true
                    });
                    // 修改成功，刷新列表
                    that.getSortList('update');

                    // 关闭弹框
                    that.dialogVisible = false;
                    // 清楚输入框内容
                    that.sortName == '';
                    // 清楚handleType
                    that.handleType = '';
                })
            }
        },

        // dialog取消按钮更改状态
        handleCancel: function () {
            this.dialogVisible = false;
            this.handleType = '';
            this.sortName = '';
            this.sortId= '';
        },

        // 点击新增/编辑弹框
        popAddBox: function (type, data) {
            if(!this.dialogVisible) {
                this.dialogVisible = true;
                this.handleType = type;
            }

            if(type == "edit") {
                this.title = "编辑分类";
                this.sortName = data.sortName;
                this.sortId = data.sortId;
            }

            if(type == "add") {
                this.title = "新增分类";
            }
        },

        // 分享该分类
        popShareBox: function (data, type) {
            this.tableLoading = true;
            switch (type) {
                case 'share': 
                    let sortId = data.sortId;
                    $axios.post('/api/share/create_sort', {sortId: sortId}).then((res) => {
                        this.tableLoading = false;

                        // this.shareBox = true;
                        if(res.data && res.data.code && res.data.code != '0000') {
                            Message.error({
                                message: res.data.message || '分享失败，请稍后重试~',
                                center: true
                            });
                            return;
                        }
                        // 提示成功
                        Message.success({
                            message: res.message || '分享分类成功',
                            type: 'info',
                            center: true
                        });
                        // 刷新列表修改状态
                        this.getSortList('get');                        
                    });
                    break;
                
                case 'cancel':
                    let shareId = data.shareId;
                    let params = {
                        shareId,
                    }
                    $axios.delete('/api/share/del', {params: params}).then((res) => {
                        // 提示成功
                        Message.success({
                            message: res.message || '取消分类分享成功',
                            type: 'info',
                            center: true
                        });
                        this.tableLoading = false;

                        // 刷新列表修改状态
                        this.getSortList('get');   
                    });
                    break;

                case 'copy': 
                    let url = data.shareUrl;     
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
                        this.tableLoading = false;
                    }
                    document.body.removeChild(input);
            }
        },

        // 复制分享链接功能
        copyLink: function () {

        },

        // 隐藏分享弹框
        handleShareCancel: function () {
            this.shareBox = false;
        },

        // 获取分类列表
        getSortList: function (params) {
            $axios.get('/api/sort/list', {}).then((res) => {
                if (res.data) {
                    this.tableLoading = false;
                    this.tableData = res.data && res.data.data && res.data.data.list || [];
                    this.setTableData = [{sortId: "", sortName: "全部"}, ...this.tableData];
                    this.selecetedId = res.data && res.data.data && res.data.data.defaultLoadSortId;
                    
                }
            })
            // this.$store.dispatch('getSortList', {
            //     sortId: '',
            //     sortName: '',
            //     type: params
            // }).then((res) => {
            //     this.tableLoading = false;
            //     this.tableData = res || [];
            // })
        },

        // 更改默认加载分类
        changeDefault(val) {
            $axios.post('/api/sort/set_default_load_sort_id', { sortId: val }).then((res) => {
                // 提示成功
                Message.success({
                    message: '设置默认加载分类成功',
                    type: 'info',
                    center: true
                });
                // 添加成功，刷新列表
                // this.getSortList('update');
            })
            // console.log('defalut', val)
        },

        // 点击删除弹框
        popDelBox: function (data) {
            console.log(data);
            if(!this.delBox) {
                this.delData = {...data};
                this.delBox = true;                
            }
        },
        // 取消删除
        handleDelCancel: function () {
            this.delBox = false;
            this.delData = {};
        },

        // 删除一条分类
        handleDel: function (data) {
            let that = this;
            let sortId = this.delData.sortId;
            let params = {
                sortId: sortId
            };
            if(!sortId) {
                return false;
            }
            $axios.delete('/api/sort/del', {params: params}).then((res) => {
                // 关闭弹框
                that.delBox = false;
                // 提示成功
                if(res.data && res.data.code) {
                    Message.error({
                        message: res.data.message,
                        center: true
                    });
                    return false;
                }
                Message.success({
                    message: res.data.message || '删除分类成功',
                    type: 'info',
                    center: true
                });
                
                // 添加成功，刷新列表
                that.getSortList('update');
            })
        },

        // 时间戳格式化
        timeFormat: function (date) {
            return Common.formatTime(date);
        }
    },
    mounted() {
        // this.getSortList({
        //     sortName: '',
        //     sortId: ''
        // });
        this.getSortList('get');
    }
}
</script>
<style scoped>
    .content-wrapper {
        margin: 20px auto;
        width: 70%;
    }
    
    .title {
        text-align: center;
        font-size: 16px;
    }
    .tips {
        font-size: 12px;
        padding-top: 10px;
        line-height: 18px;
        color: rgb(64, 158, 255);
    }
    .category-list header {
        display: flex;
        align-items: center;
        margin: 10px;
    }
    .category-list header h3 {
        flex: 1;
    }

    .category-manage {
        margin-top: 30px;
    }
    .category-manage header {
        display: flex;
        align-items: center;
        margin: 10px;
    }
    .category-manage small {
        font-size: 12px;
        color: #bbb;
        padding-left: 5px;
    }
    .category-manage .radio-button {
        margin: 0 10px 10px 10px;
        width: 150px;
        text-align: center;

    }
</style>

