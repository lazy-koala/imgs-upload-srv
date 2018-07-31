<template>
    <div>
        <el-table
          :data="tableData"
          border
          @selection-change="selectedTokens"
          style="width: 100%">
          <el-table-column
            type="selection"
          >
          </el-table-column>
          <el-table-column
            prop="token"
            label="token">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="expiration"
            label="失效日期">
          </el-table-column>
        </el-table>
        <div class="del-btn">
          <el-button @click="handleDelete()" type="primary" size="small">批量删除</el-button>
        </div>
        <el-dialog
        title="提示"
        :visible.sync="showDel"
        width="40%"
        center>
            <span>是否确认删除token?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDel = false">取 消</el-button>
                <el-button type="primary" @click="deleteToken()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
    import $axios from 'axios';
    import Common from "../../../assets/scripts/common.js";
    import { Message } from 'element-ui';
    export default {
        name: "Token",
        data() {
          return {
            showDel: false,
            selected: [],
            list: this.tokenList
          }
        },
        props: {
          tokenList: {
            type: Array
          },
          tokenTab: {
            type: Boolean
          }
        },

        computed: {
          tableData: function () {
            var list = [];
            var tokenList = this.tokenList;
            this.list = this.tokenList;
            for (var i = 0; i < tokenList.length; i++) {
              var obj = tokenList[i];
              var item = {
                "_id" : obj._id,
                "userId" : obj.userId,
                "token" : obj.token,
                "expiration" : Common.formatTime(obj.expiration),
                "createTime" : Common.formatTime(obj.createTime)
              };
              list.push(item);
            }
            return list;
          }
        },
        methods: {
          handleDelete: function () {
            var list = this.selected;
            var ids = [];
            var that = this;
            if (list.length < 1) {
                Message.error({
                    message: '请先选择要删除的token',
                    type: 'error',
                    center: true
                });
                return false;
            }
            this.showDel = true;
          },
          deleteToken: function () {
            var that = this;
            var list = this.selected;
            var ids = [];
            for (var i = 0, j=0; i < list.length; i++) {
              var item = list[i];
              ids[j++] = item._id;
            };
            $axios.post('/api/token/del', {ids: ids}).then((res) => {
                if (res.data) {
                    Message.success({
                        message: res.data.message || '删除成功',
                        type: 'info',
                        center: true
                    });
                    that.showDel = false;
                    that.$emit('refreshToken');
                }
            }).catch(function (error) {
                // that.catchError(error);
            })

          },
          selectedTokens: function (list) {
            this.selected = list;
          }
        }
    }
</script>
<style>
.del-btn {
  text-align: center;
  margin-top: 20px;
}

</style>