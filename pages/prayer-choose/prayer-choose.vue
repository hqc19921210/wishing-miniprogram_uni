<template>
    <view>
        <wishing-navigation theme="pink" :showBack="true"></wishing-navigation>

        <view class="body tab-bar-body">
            <view class="prayer-bg" :style="'height: ' + height + ' ; width: 100%;'">
                <view class="info-bar text-center">
                    <view>
                        <text>许愿：</text>
                        <text style="color: #ff5656; margin-right: 10rpx">{{ prayerCount }}</text>
                        <text>个</text>
                    </view>
                    <view>
                        <text>还愿：</text>
                        <text style="color: #ff5656; margin-right: 10rpx">{{ redeemCount }}</text>
                        <text>次</text>
                    </view>
                </view>

                <view class="search-bar text-center">
                    <view style="line-height: 0.8em"><text class="score-info">敲乌龟可以积分哦 ! 积分可抵扣许愿金额</text></view>
                    <view>
                        <navigator url="/pages/score/score" class="text-center score">去积分</navigator>
                    </view>
                </view>

                <view :style="'padding: 0rpx 40rpx ;height: ' + contentHeight + ';'">
                    <scroll-view :scroll-y="true" class="prayer-choose-content">
                        <view class="choose-info view-center">
                            <view class="tips"><text>在这里\n请相信奇迹 相信您的力量\n让您的梦想照进现实\n一起开启美好人生</text></view>
                        </view>

                        <view class="title text-center">
                            <view style="width: 130rpx; height: 2rpx; background: -webkit-linear-gradient(left, #ffffff, #e11d4d)"></view>

                            <view class="text">请选择许愿类型</view>

                            <view style="width: 130rpx; height: 2rpx; background: -webkit-linear-gradient(right, #ffffff, #e11d4d)"></view>
                        </view>

                        <view :class="'prayer-type ' + (isIOS ? 'text-center' : '')">
                            <view class="prayer-info" v-for="(item, index) in prayerInfos" :key="index">
                                <view :style="'width: 100%;height: ' + flowerHeight + 'rpx;'" @tap="choose" :data-type="item.type">
                                    <image src="/static/images/prayer_flower2.png" style="height: 100%; width: 100%" mode="aspectFit" />
                                </view>

                                <view style="font-size: 40rpx; color: #e11d4d; line-height: 40rpx; text-align: center">{{ item.name }}</view>

                                <view v-if="!isIOS" style="font-size: 32rpx; color: #000000; line-height: 40rpx; margin-top: 4rpx; text-align: center">
                                    ￥{{ item.money + (item.type == 'Y' ? ' 起' : item.type == 'Z' ? ' /天' : ' ') }}
                                </view>

                                <view class="text-center prayer-memo">{{ item.memo }}</view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </view>

        <wishing-tab-bar current="-1" theme="pink"></wishing-tab-bar>
    </view>
</template>

<script>
import { showErrorMsg } from '../../utils/util';
import { prayerChooseInfo } from '../../api/apis.js';
const app = getApp();
export default {
    data() {
        return {
            height: '92vh',
            //默认全屏的百分之92%高度
            contentHeight: '700rpx',
            onBoardDays: '',
            prayerInfos: [],
            redeemCount: '',
            prayerCount: '',
            checkZhiDing: false,
            flowerHeight: 0,
            isIOS: false
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {
        var barInfo = uni.getStorageSync('barInfo'); //获取缓存中的高度
        let flowerHeight = barInfo.fullViewHeight / 4;
        if (flowerHeight > 220) {
            flowerHeight = 220;
        }
        let contentHeight = barInfo.fullViewHeight - barInfo.tabBarHeight - 30 - 50 - 20;
        console.info(barInfo);
        console.info(contentHeight);
        if (contentHeight < 400) {
            contentHeight = contentHeight + 32;
        }
        this.setData({
            //计算全屏高度
            height: barInfo.fullViewHeight - barInfo.tabBarHeight + 'px',
            //计算scroll view高度
            contentHeight: contentHeight + 'px',
            flowerHeight: flowerHeight
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.init();
    },
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
    methods: {
        init() {
            var res = uni.getSystemInfoSync();
            var isIOS = res.platform == 'ios';
            prayerChooseInfo({}).then(
                (data) => {
                    if (data.length > 0) {
                        var prayerInfos = data[0].prayerInfos;
                        if (isIOS) {
                            //ios端禁支付功能，只能显示普通愿望
                            prayerInfos = prayerInfos.filter((item) => item.type == 'P');
                        }
                        this.setData({
                            onBoardDays: data[0].onBoardDays,
                            prayerInfos: prayerInfos,
                            redeemCount: data[0].redeemCount,
                            prayerCount: data[0].prayerCount,
                            checkZhiDing: data[0].checkZhiDing,
                            isIOS: isIOS
                        });
                    }
                },
                (error) => {
                    showErrorMsg();
                }
            );
        },

        choose(e) {
            if (e.currentTarget.dataset.type == 'Z' && !this.checkZhiDing) {
                showErrorMsg('置顶愿望已满，请选择其他类型的愿望');
                return;
            }
            uni.navigateTo({
                url: '/pages/prayer-form/prayer-form?type=' + e.currentTarget.dataset.type
            });
        }
    }
};
</script>
<style lang="scss">
/* pages/assistant/assistant.wxss */
Page {
    background: -webkit-linear-gradient(top, #c4b0f7, #f8e4e6, #fbdee3, var(--themeColor_pink));
}
.prayer-bg {
}

.info-bar {
    width: 750rpx;
    height: 60rpx;
    background-color: #ffffff;

    display: flex;
    justify-content: space-evenly;
    font-size: 26rpx;
    color: #3b4e65;
}

.search-bar {
    width: 750rpx;
    height: 100rpx;
    background: -webkit-linear-gradient(top, #d0bcf9, #d6bff7);
    display: flex;
    justify-content: space-between;
    padding: 0rpx 40rpx;

    .score-info {
        font-size: 25rpx;
        width: 184rpx;
        height: 58rpx;
        text-align: left;
        color: #313131;
    }

    .score {
        width: 150rpx;
        height: 64rpx;
        background-color: #d20941;
        border-radius: 20rpx;
        font-size: 28rpx;
        color: #ffffff;
        box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(255, 157, 204, 1) inset;
    }
}

.prayer-choose-content {
    margin: 0 rpx 0rpx 4rpx 0;
    height: 100%;
    border: 4rpx solid #ffffff;
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(255, 212, 235, 0.7) inset;
    border-radius: 40rpx;

    .choose-info {
        margin-top: 20rpx;
        text-align: center;

        .tips {
            font-size: 32rpx;
            color: #e11d4d;
            font-weight: bold;
            line-height: 44rpx;
        }
    }

    .title {
        margin-top: 25rpx;
        .text {
            font-weight: bold;
            color: #000000;
            font-size: 30rpx;
            margin: 0rpx 18rpx;
        }
    }
}

.prayer-type {
    display: flex;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    /*align-content: flex-start;*/

    .prayer-info {
        width: 300rpx;
        margin: 15rpx 15rpx;

        .prayer-memo {
            font-size: 20rpx;
            color: #000000;
            line-height: 30rpx;
            margin-top: 16rpx;
            text-align: left;
            padding: 0 10rpx;
        }
    }
}
</style>
