<template>
  <div id="app" class="home-wrapper">
    <common-header isIndex="0"></common-header>
    <router-view/>
    <common-footer />
  </div>
</template>
<script>
import CommonHeader from './components/CommonHeader';
import CommonFooter from './components/CommonFooter';
export default {
  name: 'App',
  components: {CommonHeader, CommonFooter}

}
</script>
<style lang="scss">
.home-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
