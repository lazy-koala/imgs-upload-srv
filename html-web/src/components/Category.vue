<template>
    <div>
        <template>
            <common-header isIndex="1"></common-header>
        </template>
        <div class="content-wrapper">
            <el-button type="primary" class="add-btn" @click="popAddBox('add')">新增分类</el-button>
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
            <el-table
                v-loading="tableLoading"
                :data="tableData"
                border
                style="width: 100%">                
                <el-table-column
                prop="sortName"
                label="分类名称"
                width="180">
                </el-table-column>
                <el-table-column
                prop="createTime"
                label="创建时间">
                </el-table-column>
                <el-table-column
                label="操作"
                width="180">
                <template slot-scope="scope">
                    <el-button v-show="scope.row.sortName != '默认分类'" @click="popDelBox(scope.row)" type="text" size="small">删除</el-button>
                    <el-button v-show="scope.row.sortName != '默认分类'" type="text" size="small" @click="popAddBox('edit', scope.row)">编辑</el-button>
                </template>
                </el-table-column>
            </el-table>
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
import { Message } from 'element-ui';
export default {
    name: 'category',
    components: {
        'common-header': CommonHeader,
        'common-footer': CommonFooter,
    },
    data() {
        return {
            tableData: [],
            dialogVisible: false,
            sortName: '',
            handleType: '', //操作分类的类型 'add'新增分类 'edit'编辑分类
            title: '',
            delBox: false,
            delData: {},
            tableLoading: true
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

        // 获取分类列表
        getSortList: function (params) {
            // $axios.get('/api/sort/list', {params}).then((res) => {
            //     if (res.data) {
            //         this.tableData = res.data && res.data.data && res.data.data.list || [];
            //     }
            // })
            this.tableLoading = true;
            this.$store.dispatch('getSortList', {
                sortId: '',
                sortName: '',
                type: params
            }).then((res) => {
                this.tableLoading = false;
                this.tableData = res || [];
            })
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
                // 提示成功
                Message.success({
                    message: res.message || '删除分类成功',
                    type: 'info',
                    center: true
                });
                // 关闭弹框
                that.delBox = false;
                // 添加成功，刷新列表
                that.getSortList('update');
            })
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
</style>

