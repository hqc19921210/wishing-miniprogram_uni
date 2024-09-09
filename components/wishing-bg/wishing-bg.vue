<template>
    <view>
        <view v-if="!!src">
            <image class="bg" :src="src" mode="aspectFill"></image>
        </view>
        <view v-if="!!color">
            <view class="bg" :style="'width: 100%;height: 100%;background-color: ' + color + ';background: ' + color + ';'"></view>
        </view>
    </view>
</template>

<script>
// components/wishing-bg/wishing-bg.js
export default {
    data() {
        return {};
    },
    /**
     * 组件的属性列表
     */
    props: {
        src: {
            type: String,
            default: ''
        },
        color: {
            type: String,
            default: ''
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {},
    created: function () {}
};
</script>
<style lang="scss">
/* components/wishing-bg/wishing-bg.wxss */
.bg {
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
    z-index: -10;
    /* 通过滤镜增加毛玻璃效果 filter: blur(10rpx); */
}
</style>
