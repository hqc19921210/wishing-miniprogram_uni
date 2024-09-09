<template>
    <view>
        <wishing-navigation theme="pink"></wishing-navigation>

        <view class="body tab-bar-body">
            <view class="prayer-bg" :style="'height: ' + height + ' ; width: 100%;'">
                <scroll-view :scroll-y="true" class="prayer-content">
                    <view style="margin-top: 50rpx">
                        <view class="title view-center">
                            <text class="text">恭喜!</text>
                        </view>
                        <view class="title view-center">
                            <text class="text">您的{{ type == 'R' ? '还愿' : '许愿' }}已经完成</text>
                        </view>
                        <view class="title view-center">
                            <text style="margin-top: 10rpx; font-size: 26rpx; color: gray">编号：{{ prayerNo }}</text>
                        </view>
                    </view>

                    <view :style="'display: flex;justify-content: space-around; margin-top:' + marginTop / 2 + 'px;'">
                        <view style="width: 160rpx; height: 160rpx" @tap="toCheck">
                            <image style="width: 100%; height: 100%" src="/static/images/pay_success_check.png" mode="aspectFit" />
                        </view>
                        <view class="share">
                            <image class="shareView" style="width: 160rpx; height: 160rpx" src="/static/images/pay_success_share.png" mode="aspectFit" />
                            <button style="width: 100%; height: 70%" open-type="share" class="shareButton">1</button>
                        </view>
                    </view>

                    <view class="view-center" :style="'margin-top: ' + (marginTop - 10) + 'px;'">
                        <image style="width: 500rpx; height: 550rpx" :src="successUrl" mode="aspectFit" />
                    </view>
                </scroll-view>
            </view>
        </view>

        <wishing-tab-bar :current="1" theme="pink"></wishing-tab-bar>
    </view>
</template>

<script>
import { getFullUrl } from '../../utils/util';
export default {
    data() {
        return {
            height: '92vh',
            //默认全屏的百分之92%高度
            marginTop: 0,
            type: '',
            id: '',
            prayerNo: '',
            successUrl: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {
        var barInfo = uni.getStorageSync('barInfo'); //获取缓存中的高度
        let type = options.type;
        let url = '/attachment/business/pay_success.png';
        if (type == 'R') {
            url = '/attachment/business/redeem_success.png';
        }
        let marginTop = 20;
        if (barInfo.fullViewHeight > 600) {
            marginTop = barInfo.fullViewHeight / 10;
        }
        this.setData({
            height: barInfo ? barInfo.fullViewHeight - barInfo.tabBarHeight + 'px' : this.height,
            //计算全屏高度
            prayerNo: options.prayerNo,
            type: options.type,
            id: options.id,
            successUrl: getFullUrl(url),
            marginTop: marginTop
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
    onShareAppMessage() {
        return {
            title: '祈愿',
            path: 'pages/prayer-info/prayer-info?prayerNo=' + this.prayerNo
        };
    },
    methods: {
        toCheck() {
            uni.navigateTo({
                url: '/pages/prayer-info/prayer-info?prayerNo=' + this.prayerNo
            });
        }
    }
};
</script>
<style lang="scss">
Page {
    background: -webkit-linear-gradient(top, #c4b0f7, #f8e4e6, #fbdee3, var(--themeColor_pink));
}

.prayer-bg {
    padding: 0rpx 40rpx;
}
.prayer-content {
    margin: 0 rpx 0rpx 4rpx 0;
    height: 100%;
    border: 4rpx solid #ffffff;
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(255, 212, 235, 0.7) inset;
    border-radius: 40rpx;

    .title {
        display: flex;
        justify-content: center;

        .text {
            font-size: 48rpx;
            color: #e11d4d;
            font-weight: 550;
        }
    }

    .info {
        margin-top: 20rpx;
        text-align: center;

        .flower {
            margin-top: 66rpx;
            width: 350rpx;
            height: 226rpx;
        }

        .prayer-no {
            margin-top: 78rpx;
            width: 576rpx;
            height: 68rpx;
            background-color: #f8e0ed;
            border-radius: 20rpx;
            font-size: 26rpx;
            color: #393939;
        }

        .payment {
            width: 576rpx;
            display: flex;
            justify-content: space-between;
            margin-top: 20rpx;
            padding: 0rpx 10rpx;

            .name {
                font-size: 26rpx;
                color: #393939;
            }

            .money {
                font-size: 30rpx;
                color: #e11d4d;
            }
        }

        .line {
            margin-top: 16rpx;
            width: 576rpx;
            height: 2rpx;
            background-color: #e11d4d;
        }
    }
}
.share {
    position: relative;
}

.shareButton {
    top: -180rpx;
    opacity: 0;
    display: block;
}

.shareView {
    opacity: 1;
}
</style>
