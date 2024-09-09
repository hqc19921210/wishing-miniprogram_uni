<template>
    <view>
        <wishing-navigation theme="pink"></wishing-navigation>
        <van-popup :show="showLoading" @close="onClose"></van-popup>
        <view class="body tab-bar-body">
            <view class="prayer-bg" :style="'height: ' + height + ' ; width: 100%;'">
                <scroll-view :scroll-y="true" :enhanced="true" :show-scrollbar="false" class="prayer-content">
                    <view class="title text-center">
                        <view class="text">还愿</view>
                    </view>

                    <view class="view-center" style="text-align: center">
                        <text style="font-size: 22rpx; line-height: 35rpx">
                            恭喜您梦想成真了！\n您是祈愿池第
                            <text style="color: red">{{ redeemCount }}</text>
                            位实现愿望的朋友\n祝您在以后的生活和工作中诸事顺逐平安喜乐!
                        </text>
                    </view>

                    <view class="form-column form-line">
                        <view class="text-center form-label">愿望编号:</view>
                        <view class="form-input text-center" style="font-size: 20rpx" @tap="showPrayerNo">
                            {{ currentPrayerNo }}
                        </view>

                        <view class="prayer-view text-center" @tap="viewPrayer">预览</view>
                    </view>

                    <view class="form-column">
                        <view class="form-textare text-center" style="text-align: center; position: relative; padding: 20rpx 20rpx 100rpx 20rpx">
                            <view style="font-size: 30rpx; color: #e11d4d; font-weight: bold">
                                {{ prayerInfo.detail }}
                            </view>

                            <view style="position: absolute; bottom: 10rpx">
                                <text style="color: red; font-size: 24rpx">{{ name }}</text>
                                <text style="color: gray; font-size: 24rpx">\n{{ prayerInfo.prayerDate }}</text>
                            </view>
                        </view>
                    </view>

                    <!-- <view class="view-center" style="width: 100%;">

				<view class="redeem-medium {{ mediumSize < 2 ? 'view-center':''   }}" >
					<view class="medium" wx:if="{{prayerInfo.imgUrl}}">
						<image src="{{prayerInfo.imgUrl}}" mode="aspectFit" style="height: 100% ; width: 100%;" />
					</view>

					<view class="medium view-center" wx:if="{{prayerInfo.voiceUrl}}" bindtap="playOrStop">
						<image wx:if="{{playStatus}}" style="width: 70rpx;height: 70rpx;" src="/images/icons/stop.png" mode="aspectFit" />

						<image wx:if="{{!playStatus}}" style="width: 70rpx;height: 70rpx;" src="/images/icons/play.png" mode="aspectFit" />
					</view>
				</view>

			</view> -->

                    <view class="form-column form-line" v-if="!isIOS">
                        <view class="text-center form-label">还愿金额:</view>

                        <view class="form-input text-center"><input style="width: 90%" type="digit" @input="getMoney" /></view>
                    </view>

                    <view class="view-center">
                        <view v-if="!isIOS" class="pay text-center" @tap="pay">
                            <view>
                                <image style="width: 50rpx; height: 50rpx; margin-top: 8rpx; margin-right: 8rpx" src="/static/images/icons/wx-pay.png" mode="aspectFill" />
                            </view>
                            <view style="font-size: 32rpx; color: #09bb07">微信支付</view>
                        </view>

                        <view v-else class="pay-disabled text-center">由于相关规范，IOS端还愿功能暂不可用</view>
                    </view>
                </scroll-view>
            </view>
        </view>
        <picker
            :isShowPicker="isShowPrayerNo"
            @sure="surePrayerNo"
            @cancle="canclePrayerNo"
            scrollType="normal"
            :listData="prayerList"
            sureStyle="color:#09BB07"
            keyWordsOfShow="prayerNo"
            titleText="愿望编号"
        ></picker>
        <wishing-tab-bar :current="1" theme="pink"></wishing-tab-bar>
    </view>
</template>

<script>
import picker from '@/components/picker/picker';
import { toRedeem, payRedeem } from '../../api/apis.js';
import { getFullUrl, showErrorMsg } from '../../utils/util';
import { getsetOpenid } from '../../utils/api-until.js';
export default {
    components: {
        picker
    },
    data() {
        return {
            height: '92vh',

            //默认全屏的百分之92%高度

            isShowPrayerNo: false,

            prayerList: [],

            prayerInfo: {
                detail: '',
                prayerDate: ''
            },

            openId: '',
            currentPrayerNo: '',
            mediumSize: 0,
            playStatus: false,
            name: '',
            money: '',
            showLoading: false,
            isIOS: false,
            redeemCount: ''
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let that = this;
        var barInfo = uni.getStorageSync('barInfo'); //获取缓存中的高度
        var res = uni.getSystemInfoSync();
        var isIOS = res.platform == 'ios';
        this.setData({
            height: barInfo ? barInfo.fullViewHeight - barInfo.tabBarHeight + 'px' : this.height,
            //计算全屏高度
            currentPrayerNo: options.prayerNo,
            isIOS: isIOS
        });
        this.redeemAaudioPlay = uni.createInnerAudioContext();
        this.redeemAaudioPlay.onPlay(() => {
            console.log('开始播放');
            that.setData({
                playStatus: true
            });
        });
        this.redeemAaudioPlay.onEnded(() => {
            console.log('播放完毕');
            that.setData({
                playStatus: false
            });
        });
        this.redeemAaudioPlay.onError((res) => {
            console.log('播放失败', res);
            that.setData({
                playStatus: false
            });
        });
        this.redeemAaudioPlay.onStop((res) => {
            console.log('播放停止', res);
            that.setData({
                playStatus: false
            });
        });
        this.redeemAaudioPlay.onPause((res) => {
            console.log('播放暂停', res);
            that.setData({
                playStatus: false
            });
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
        viewPrayer() {
            if (!this.currentPrayerNo) {
                return;
            }
            uni.navigateTo({
                url: '/pages/prayer-info/prayer-info?prayerNo=' + this.currentPrayerNo
            });
        },

        showPrayerNo: function () {
            this.setData({
                isShowPrayerNo: true
            });
        },

        surePrayerNo(e) {
            console.info(e);
            this.setData({
                prayerInfo: e.detail.choosedData[0],
                currentPrayerNo: e.detail.choosedData[0].prayerNo,
                isShowPrayerNo: false
            });
        },

        canclePrayerNo() {
            this.setData({
                isShowPrayerNo: false
            });
        },

        init() {
            let that = this;
            getsetOpenid().then((openId) => {
                this.setData({
                    openId: openId
                });
                toRedeem({
                    prayerNo: this.currentPrayerNo,
                    openId: openId
                }).then((data) => {
                    if (data.length > 0) {
                        console.info(data[0].prayerList);
                        let prayerInfo = data[0].prayerInfo;
                        let mediumSize = 0;
                        if (!!prayerInfo.voiceUrl) {
                            prayerInfo.voiceUrl = getFullUrl(prayerInfo.voiceUrl);
                            mediumSize = mediumSize + 1;
                        }
                        if (!!prayerInfo.imgUrl) {
                            prayerInfo.imgUrl = getFullUrl(prayerInfo.imgUrl);
                            mediumSize = mediumSize + 1;
                        }
                        that.setData({
                            prayerInfo: prayerInfo,
                            prayerList: data[0].prayerList,
                            redeemCount: data[0].redeemCount,
                            currentPrayerNo: data[0].currentPrayerNo,
                            mediumSize: mediumSize,
                            name: data[0].name
                        });
                    }
                });
            });
        },

        getMoney(e) {
            this.setData({
                money: e.detail.value
            });
        },

        pay() {
            let moneyPattern = /^(([0-9]\d*)|\d)(\.\d{1,2})?$/;
            if (!moneyPattern.test(this.money)) {
                showErrorMsg('金额格式不正确');
                return;
            }
            if (this.money < 0.01) {
                showErrorMsg('金额最小为0.01');
                return;
            }
            if (!this.openId) {
                showErrorMsg('请先授权用户信息');
                return;
            }
            if (!this.currentPrayerNo) {
                showErrorMsg('请选择愿望编号');
                return;
            }
            this.setData({
                showLoading: true
            });
            let that = this;
            payRedeem({
                openId: that.openId,
                prayerNo: that.currentPrayerNo,
                money: that.money
            })
                .then((data) => {
                    this.setData({
                        showLoading: false
                    });
                    var per = data[0];
                    console.info(!per.packageVal);
                    if (!per.packageVal) {
                        //console.log("预付单建立失败，检查后台");
                        showErrorMsg('系统异常,请稍后重试!');
                        return;
                    }
                    per.package = per.packageVal;
                    per.success = function (res) {
                        console.log(res);
                        let url = '/pages/prayer-success/prayer-success?type=R&prayerNo=' + that.currentPrayerNo;
                        uni.navigateTo({
                            url: url
                        });
                    };
                    per.fail = function (res) {
                        console.log(res);
                    };
                    uni.requestPayment(per);
                })
                .catch((err) => {
                    console.log('预付单建立失败，检查后台');
                    console.log(err);
                    this.setData({
                        showLoading: false
                    });
                    showErrorMsg('支付异常，请稍后重试');
                });
        },

        //播放声音
        play: function () {
            if (!!this.prayerInfo.voiceUrl) {
                this.redeemAaudioPlay.src = this.prayerInfo.voiceUrl;
                this.redeemAaudioPlay.stop();
                this.redeemAaudioPlay.play();
            }
        },

        stopPlay() {
            if (!!this.playStatus) {
                this.redeemAaudioPlay.stop();
            }
        },

        playOrStop() {
            if (this.playStatus) {
                this.stopPlay();
            } else {
                this.play();
            }
        },

        onClose() {
            console.log('占位：函数 onClose 未声明');
        }
    }
};
</script>
<style lang="scss">
Page {
    background: var(--themeColor_pink);
}

.prayer-bg {
    padding: 0rpx 40rpx;
    background: -webkit-linear-gradient(top, #c4b0f7, #f8e4e6, #fbdee3, var(--themeColor_pink));
}

.prayer-content {
    margin: 0 rpx 0rpx 4rpx 0;
    height: 100%;
    border: 4rpx solid #ffffff;
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(255, 212, 235, 0.7) inset;
    border-radius: 40rpx;
    padding: 0rpx 24rpx;

    .title {
        display: flex;
        justify-content: center;
        margin-top: 32rpx;

        .text {
            font-size: 48rpx;
            color: #e11d4d;
            font-weight: 550;
        }
    }

    .pay {
        margin-top: 80rpx;
        width: 280rpx;
        height: 92rpx;
        border-radius: 46rpx;
        border: 2rpx solid #09bb07;

        display: flex;
        justify-content: center;

        margin-bottom: 50rpx;
    }

    .pay-disabled {
        margin-top: 80rpx;
        width: 420rpx;
        height: 72rpx;
        border-radius: 46rpx;
        background-color: gray;
        color: #ffffff;
        box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(248, 248, 248, 0.7) inset;
        font-size: 22rpx;
    }

    .form-line {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
    }

    .form-column {
        margin-top: 30rpx;

        .form-label {
            width: 132rpx;
            font-size: 26rpx;
            color: #313131;
            height: 64rpx;
        }

        .form-input {
            width: 292rpx;
            height: 64rpx;
            border-radius: 42rpx;
            border: 2rpx solid #e11d4d;
            margin-left: 30rpx;
        }

        .form-textare {
            width: 100%;
            min-height: 400rpx;
            border-radius: 20rpx;
            border: 2rpx solid #e11d4d;
        }
    }

    .prayer-view {
        font-size: 28rpx;
        margin-left: 30rpx;
        width: 120rpx;
        height: 64rpx;
        border-radius: 40rpx;
        background-color: #e11d4d;
        color: #ffffff;
        box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(255, 212, 235, 0.7) inset;
    }
}

.redeem-medium {
    display: flex;
    justify-content: space-between;
    width: 580rpx;

    .medium {
        width: 280rpx;
        height: 200rpx;
        border: 2rpx solid #e11d4d;
        border-radius: 20rpx;
        overflow: hidden;
    }
}
</style>
