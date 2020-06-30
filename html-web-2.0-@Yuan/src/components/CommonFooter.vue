<template>
<div class="footer">
    <!-- <a href="https://github.com/lazy-koala/"><img src="https://img.shields.io/badge/org-@LazyKoala-yellow.svg" alt="org" data-canonical-src="https://img.shields.io/badge/org-@LazyKoala-yellow.svg" style="max-width:70%;"></a> -->
    <span>&copy;Copyright (C) 2018-2020 All rights reserved</span>
</div>
</template>
<script type="text/javascript">
    export default {
        name: 'CommonFooter'
    }
</script>
<style lang="scss" scoped>
.footer {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background: #EEEEEE;
    border-top: 1px solid #ccc;
    text-align: center;
    padding: 10px 0;
    span {
        color: #888;
        font-size: 12px;
    }
}
</style>