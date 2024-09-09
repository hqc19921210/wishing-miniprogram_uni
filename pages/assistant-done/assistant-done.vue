<template>
    <view>
        <wishing-navigation theme="blue" :showShadow="false"></wishing-navigation>

        <view class="body tab-bar-body">
            <view class="ass-bg" :style="'height: ' + height + ' ; width: 100%;'">
                <scroll-view :scroll-y="true" class="content">
                    <view class="ass-msg-sys" style="margin-top: 206rpx">
                        <view class="head">
                            <image style="width: 100%; height: 100%" src="/static/images/assistant_head.png" mode="aspectFill" />
                        </view>
                        <view class="text text-center">
                            <text>我们已收到您的计划，3天内，我们会给您回复哦，请留意个人中心-我的消息。</text>
                        </view>
                    </view>

                    <view class="ass-msg-sys" style="margin-top: 140rpx; position: relative">
                        <view class="head" style="position: absolute; bottom: 0rpx">
                            <image style="width: 100%; height: 100%" src="/static/images/assistant_head.png" mode="aspectFill" />
                        </view>
                        <view class="text text-center" style="position: relative; left: 150rpx">
                            <text>
                                我们有一些资讯，希望可以帮到您。您对我们的服务有什么意见和建议，请给我们留言，我们将以真诚和用心的态度对待每一句留言，把祈愿池做得更好，真正服务到每一个需要的人。
                            </text>
                        </view>
                    </view>

                    <view class="text-center" style="margin-bottom: 100rpx; margin-top: 250rpx">
                        <navigator class="button-view" url="/pages/article/article">文章</navigator>
                    </view>
                </scroll-view>
            </view>
        </view>

        <wishing-tab-bar :current="2" theme="blue"></wishing-tab-bar>
    </view>
</template>

<script>
// pages/assistant-done/assistant-done.js
export default {
    data() {
        return {
            height: '92vh' //默认全屏的百分之92%高度
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {
        var barInfo = uni.getStorageSync('barInfo'); //获取缓存中的高度
        this.setData({
            height: barInfo ? barInfo.fullViewHeight - barInfo.tabBarHeight + 'px' : this.height //计算全屏高度
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {},
    methods: {}
};
</script>
<style lang="scss">
Page {
    background: var(--themeColor_blue);
}
.ass-bg {
    padding: 0rpx 40rpx;
    background: var(--themeColor_blue);
}
.content {
    margin: 0 rpx 0rpx 4rpx 0;
    height: 100%;
    border: 4rpx solid #ffffff;
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(0, 0, 0, 0.07);
    border-radius: 40rpx;
}

.top-button {
    display: flex;
    justify-content: space-between;
    margin-top: 40rpx;
}

.button-view {
    height: 72rpx;
    width: 220rpx;
    border-radius: 46rpx;
    border: 2rpx solid #255fe8;

    font-size: 26rpx;
    color: #255fe8;

    /*文字居中*/
    display: flex;
    align-items: center;
    justify-content: center;
}

.ass-msg-sys {
    display: flex;
    justify-content: flex-start;

    .head {
        width: 108rpx;
        height: 130rpx;

        margin-left: 40rpx;
    }

    .text {
        margin-left: 20rpx;
        background-color: #f5f5f5;
        border-radius: 40rpx 40rpx 40rpx 0;
        width: 370rpx;
        min-height: 144rpx;
        padding: 24rpx;
        font-size: 26rpx;
    }
}

.ass-msg-user {
    display: flex;
    justify-content: flex-end;

    .head {
        width: 108rpx;
        height: 130rpx;

        margin-right: 28rpx;
    }

    .text {
        margin-right: 20rpx;
        background-color: #ebf5fd;
        border-radius: 40rpx 40rpx 0 40rpx;
        width: 370rpx;
        /*height: 144rpx;*/
        padding: 24rpx;
        font-size: 26rpx;
    }
}
</style>
