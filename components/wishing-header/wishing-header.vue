<template>
    <view class="header">header</view>
</template>

<script>
export default {
    data() {
        return {};
    },
    /**
     * 组件的属性列表
     */
    props: {},
    /**
     * 组件的方法列表
     */
    methods: {},
    created: function () {}
};
</script>
<style lang="scss">
.header {
    height: 120rpx;
    border: 1px solid var(--themeColor);
    display: flex;
    justify-content: space-between;
    padding: 0 30rpx;
    align-items: center;

    .logo {
        height: 70rpx;

        .pic {
            height: 100%;
        }
    }

    .search {
        color: var(--themeColor);
        .vanicon {
            font-size: 50rpx;
        }
    }
}
</style>
