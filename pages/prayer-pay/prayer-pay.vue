<template>
    <view>
        <wishing-navigation theme="pink" :showBack="true"></wishing-navigation>
        <van-popup :show="showLoading" @close="onClose"></van-popup>
        <view class="body tab-bar-body">
            <view class="prayer-bg" :style="'height: ' + height + ' ; width: 100%;'">
                <scroll-view :scroll-y="true" class="prayer-content">
                    <view class="title text-center">
                        <view style="width: 130rpx; height: 2rpx; background: -webkit-linear-gradient(left, #ffffff, #e11d4d)"></view>
                        <view style="height: 6rpx; width: 6rpx; background-color: #e11d4d; border-radius: 50%; margin-left: 6rpx; margin-right: 26rpx"></view>
                        <view class="text">{{ prayerName }}</view>
                        <view style="height: 6rpx; width: 6rpx; background-color: #e11d4d; border-radius: 50%; margin-right: 6rpx; margin-left: 26rpx"></view>
                        <view style="width: 130rpx; height: 2rpx; background: -webkit-linear-gradient(right, #ffffff, #e11d4d)"></view>
                    </view>

                    <view class="info view-center">
                        <view>
                            <text style="font-size: 22rpx; padding: 0rpx 20rpx">{{ prayerMemo }}</text>
                        </view>
                        <view class="flower">
                            <image src="/static/images/prayer_flower2.png" style="height: 100%; width: 100%" mode="aspectFit" />
                        </view>
                        <view class="prayer-no text-center">编号：{{ prayerNo }}</view>

                        <view class="payment">
                            <view class="name">{{ prayerName }}</view>
                            <view class="money" style="padding-right: 20rpx">￥{{ money }}</view>
                        </view>

                        <view class="payment" v-if="prayerType != 'Y'">
                            <view class="name">积分抵扣</view>
                            <view class="money" @tap="showScore">
                                <text style="padding-right: 10rpx">-￥{{ useScore / 100 }}</text>
                                <image style="width: 20rpx; height: 20rpx" src="/static/images/icons/arrow.png" mode="aspectFill" />
                            </view>
                        </view>
                        <picker
                            :isShowPicker="isShowScore"
                            @sure="submitScore"
                            @cancle="cancleScore"
                            scrollType="normal"
                            :listData="scoreList"
                            titleText="积分抵扣"
                            sureStyle="color:#09BB07"
                        ></picker>

                        <view class="line"></view>

                        <view class="pay-info">
                            <text style="font-size: 26rpx; margin-right: 20rpx">合计</text>
                            <text style="font-size: 30rpx; color: #e11d4d">￥{{ moneyShow }}</text>
                        </view>

                        <view class="pay text-center" @tap="pay">
                            <view><image style="width: 50rpx; height: 50rpx; margin-top: 8rpx; margin-right: 8rpx" src="/static/images/icons/wx-pay.png" mode="aspectFill" /></view>
                            <view style="font-size: 32rpx; color: #09bb07">微信支付</view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>

        <wishing-tab-bar :current="1" theme="pink"></wishing-tab-bar>
    </view>
</template>

<script>
import picker from '@/components/picker/picker';
import { requestPayment, payWithScore } from '../../api/apis.js';
import { getsetOpenid } from '../../utils/api-until.js';
import { showErrorMsg } from '../../utils/util';
export default {
    components: {
        picker
    },
    data() {
        return {
            height: '92vh',
            //默认全屏的百分之92%高度
            prayerId: '',
            openId: '',
            paymentId: '',
            maxScore: 0,
            useScore: 0,
            prayerType: '',
            prayerName: '',
            prayerMemo: '',
            money: '',
            prayerNo: '',
            scoreList: [],
            isShowScore: false,
            showLoading: false,
            moneyShow: ''
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var barInfo = uni.getStorageSync('barInfo'); //获取缓存中的高度
        this.setData({
            height: barInfo ? barInfo.fullViewHeight - barInfo.tabBarHeight + 'px' : this.height,
            //计算全屏高度
            prayerId: options.id
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
        showScore() {
            console.info('showScore');
            if (this.maxScore > 0) {
                this.setData({
                    isShowScore: true
                });
            }
        },

        submitScore(e) {
            console.info(e);
            let useScore = e.detail.choosedData[0];
            let moneyShow = this.money - useScore / 100;
            moneyShow = moneyShow.toFixed(2);
            this.setData({
                isShowScore: false,
                useScore: useScore,
                moneyShow: moneyShow
            });
        },

        cancleScore() {
            this.setData({
                isShowScore: false
            });
        },

        pay() {
            this.setData({
                showLoading: true
            });
            let that = this;
            payWithScore({
                openId: that.openId,
                score: that.useScore,
                paymentId: that.paymentId,
                prayerType: that.prayerType
            })
                .then((data) => {
                    console.log(data);
                    this.setData({
                        showLoading: false
                    });
                    var per = data[0];
                    let url = '/pages/prayer-success/prayer-success?type=P&prayerNo=' + that.prayerNo;
                    if (!!per.paySuccess) {
                        //不用发起支付的情况
                        uni.navigateTo({
                            url: url
                        });
                    } else {
                        if (!per.packageVal) {
                            //console.log("预付单建立失败，检查后台");
                            showErrorMsg('系统异常请稍后重试');
                            return;
                        }
                        per.package = per.packageVal;
                        per.success = function (res) {
                            console.log(res);
                            uni.navigateTo({
                                url: url
                            });
                        };
                        per.fail = function (res) {
                            console.log(res);
                        };
                        uni.requestPayment(per);
                    }
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

        init() {
            const that = this;
            getsetOpenid().then((openId) => {
                this.setData({
                    openId: openId
                });
                requestPayment({
                    openId: openId,
                    prayerId: that.prayerId
                }).then((data) => {
                    if (data.length > 0) {
                        const maxScore = data[0].maxScore;
                        let scoreList = [];
                        let list = [];
                        for (let c = maxScore; c >= 0; c = c - 100) {
                            list.push(c);
                        }
                        scoreList.push(list);
                        let moneyShow = data[0].money - maxScore / 100;
                        moneyShow = moneyShow.toFixed(2);
                        that.setData({
                            prayerName: data[0].name,
                            prayerType: data[0].type,
                            prayerMemo: data[0].memo,
                            money: data[0].money,
                            prayerNo: data[0].prayer_no,
                            paymentId: data[0].paymentId,
                            maxScore: maxScore,
                            useScore: maxScore,
                            scoreList: scoreList,
                            moneyShow: moneyShow
                        });
                    }
                });
            });
        },

        onClose() {
            console.log('占位：函数 onClose 未声明');
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
        margin-top: 32rpx;

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

        .pay-info {
            margin-top: 24rpx;
            padding: 0rpx 10rpx;

            text-align: right;
            width: 576rpx;
        }

        .pay {
            margin-top: 140rpx;
            width: 280rpx;
            height: 92rpx;
            border-radius: 46rpx;
            border: 2rpx solid #09bb07;

            display: flex;
            justify-content: center;

            margin-bottom: 50rpx;
        }
    }
}
</style>
