<template>
<div class="header-menu">
  <header class="title-wrapper">
    <div class="title" @click="gotoIndex">在线图床服务</div>
    <el-menu default-active="index" mode="horizontal" @select="gotoMenu" v-if="isIndex != 2">
      <el-menu-item index="index">
        <i class="element-icons el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="person">
        <template slot="title">
          <i class="element-icons el-icon-person"></i>
          <span>个人中心</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="person_headimg">头像昵称</el-menu-item>
          <el-menu-item index="person_pwd">密码邮箱</el-menu-item>
          <el-menu-item index="person_token">Token管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="category">
        <i class="element-icons el-icon-menu"></i>
        <span slot="title">分类管理</span>
      </el-menu-item>
      <el-menu-item index="exit">
        <i class="element-icons el-icon-exit"></i>
        <span slot="title">退出</span>
      </el-menu-item>
    </el-menu>
    <div class="tip" v-if="isIndex != 2">
      <img v-show="headImg" class="head-img" :src="headImg">
    </div>
    <div class="tip" v-if="isIndex == 2 && shareUser">
      <span>{{`来自${shareUser}的分享~`}}</span>
    </div>
  </header>
</div>
</template>

<script>
import $axios from 'axios';
import {
  Message
} from 'element-ui';

export default {
  name: 'CommonHeader',
  props: {
    isIndex: {
      type: String
    },
    shareUser: {
      type: String
    }
  },
  data() {
    return {}
  },
  computed: {
    nickname() {
      return this.$store.state.nickname
    },
    headImg() {
      return this.$store.state.headImg;
    }
  },
  methods: {

    logout: function () {
      var that = this;
      $axios.get('/api/logout').then((res) => {
        if (res.data) {
          Message.success({
            message: res.data.message || '退出成功！',
            type: 'info',
            center: true
          });
          that.$router.push('/');
        }
      })
    },
    gotoMenu: function (key) {
      // 关闭侧边栏菜单
      switch (key) {
        case 'person_headimg':
        case 'person_token':
        case 'person_pwd':
          this.$router.push({
            name: 'person',
            query: {
              index: key
            }
          });
          break;

        case 'category':
          this.$router.push('/category')
          break;

        case 'index':
          this.$router.push('/')
          break;

        case 'exit':
          this.logout();
          break;

        default:
          break;
      }
    },
    gotoIndex: function () {
      this.$router.push('/index');
    }
  }
}
</script>

<style lang="less">
.header-menu {
  position: relative;
  background: #fff;
  color: #303133;
  font-size: 24px;
  height: 60px;

  .head-img {
    display: inline-block;
    width: 40px;
    height: 40px;
    padding-right: 20px;
  }

  .sort {
    height: 100%;
    margin-left: 20px;
  }

  .tip {
    position: absolute;
    line-height: 40px;
    bottom: 10px;
    right: 10px;
    font-size: 14px;
  }

  .exit {
    padding-left: 10px;
    color: #fff;
    cursor: pointer;
  }

  .exit:hover {
    cursor: pointer
  }
}

.header-menu .title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dcdfe6;
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, .3);
}
</style>
