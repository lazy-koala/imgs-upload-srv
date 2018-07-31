<template>
<div class="footer">
    <a href="https://github.com/lazy-koala/"><img src="https://img.shields.io/badge/org-@LazyKoala-yellow.svg" alt="org" data-canonical-src="https://img.shields.io/badge/org-@LazyKoala-yellow.svg" style="max-width:100%;"></a>
    <p>&copy;Copyright (C) 2018 All rights reserved</p>
</div>
</template>
<script type="text/javascript">
    export default {
        name: 'CommonFooter'
    }
</script>
<style type="text/css" scoped>
.footer {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 80px;
    /*background: #efefef;*/
    background: #EEEEEE;
    border-top: 1px solid #ccc;
    text-align: center;
    p {
        color: #888;
        /*color: #fff;*/
        font-size: 12px;
        line-height: 30px;
    }
}
</style>