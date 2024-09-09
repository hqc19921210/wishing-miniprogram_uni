<template>
    <view class="search-view">
        <van-search style="color: red" :value="value" use-action-slot shape="round" @change="onChangeFun" @search="onSearchFun">
            <view slot="action" class="van-search_text-button" @tap="onSearchFun">搜索</view>
        </van-search>
    </view>
</template>

<script>
// components/wishing-search/wishing-search.js
export default {
    data() {
        return {
            value: ''
        };
    },
    /**
     * 组件的属性列表
     */
    props: {},
    /**
     * 组件的方法列表
     */
    methods: {
        onChangeFun(e) {
            this.setData({
                value: e.detail
            });
        },
        onSearchFun() {
            //console.log('搜索' + this.data.value);
            //触发成功回调
            this.$emit('search', {
                detail: this.value
            });
        }
    },
    created: function () {}
};
</script>
<style lang="scss">
/* components/wishing-search/wishing-search.wxss */

.search-view {
    margin-top: 20rpx;
    margin-left: 80rpx;
    width: 590rpx;

    .van-search_text-button {
        /* color: #255FE8;*/
        /* margin-left: 20rpx;*/
        /* font-size: 26rpx;*/
        margin-left: 20rpx;
        font-size: 28rpx;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #255fe8;
    }
}
</style>
