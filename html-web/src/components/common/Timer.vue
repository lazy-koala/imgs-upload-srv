<template>
    <div class="timer-wrapper">
        <el-button class="timer-btn" type="text" @click="beginTimer" v-if="!showTimer">获取验证码</el-button>
        <el-button class="timer-btn" type="text" v-if="showTimer">倒计时</el-button>
    </div>
</template>
<script type="text/javascript">
    export default {
        name: 'Timer',
        props: {
            isShowTimer: {
                type: Boolean
            },
            canUse: {
                type: Boolean
            }
        },
        data () {
            return {
                showTimer: this.isShowTimer
            }
        },
        methods: {
            beginTimer: function () {
                if (this.canUse) {
                    this.showTimer = true;
                }
            }
        }
    }
</script>
<style type="text/css" scoped>
    .timer-btn {
        display: inline-block;
        width: 80px;
        text-align: center;
    }
</style>