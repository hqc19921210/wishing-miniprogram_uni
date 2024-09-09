<template>
    <view class="footer">
        <view class="row">解释权归xxx有限公司所有</view>
        <view class="row">Copyright © {{ year }} 版权所有</view>
        <view class="row">地址</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            year: new Date().getFullYear()
        };
    },
    /**
     * 组件的属性列表
     */
    props: {
        showKeFu: {
            type: Boolean,
            default: true
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
.footer {
    padding: 50rpx 0;
    text-align: center;
    background: var(--globalBgColor2);
    border-top: 1rpx solid var(--themeColor);
    color: var(--descColor);
    font-size: 30rpx;

    line-height: 1.8em;
}
</style>
