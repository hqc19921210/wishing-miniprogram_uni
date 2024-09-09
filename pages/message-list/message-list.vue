<template>
    <view>
        <wishing-navigation theme="gray" :showBack="true"></wishing-navigation>

        <view class="body tab-bar-body">
            <view class="message-content">
                <view style="text-align: center; font-size: 28rpx; margin-top: 20rpx; color: gray" v-if="message.size == 0">暂无消息~</view>

                <navigator @tap="onclick" :id="index" :url="'/pages/sys-message/sys-message?index=' + index" v-for="(item, index) in mseeages" :key="index">
                    <view class="message-item" v-if="item.status == 0">
                        <view class="pic">
                            <image src="/static/images/icons/systemMsg.png" mode="aspectFit" class="img"></image>
                        </view>
                        <view class="msg-text">
                            <view class="info">
                                <view class="type">
                                    <text>消息通知</text>
                                </view>
                                <view class="date">
                                    <text>{{ item.update_date }}</text>
                                </view>
                            </view>
                            <view class="msg">您有一条未读消息</view>
                        </view>
                    </view>

                    <view class="message-item" v-if="item.status == 1">
                        <view class="pic">
                            <image src="/static/images/icons/unreadMsg.png" mode="aspectFit" class="img"></image>
                        </view>
                        <view class="msg-text">
                            <view class="info">
                                <view class="type">
                                    <text v-if="item.system_msg == 1">系统通知</text>
                                    <text v-if="item.system_msg == 2">管理员回复</text>
                                </view>
                                <view class="date">
                                    <text>{{ item.update_date }}</text>
                                </view>
                            </view>
                            <view class="msg text_overflow1">{{ item.message }}</view>
                        </view>
                    </view>
                </navigator>
            </view>

            <view class="loadOut">
                <van-loading size="24px" v-if="loading">加载中...</van-loading>
            </view>
        </view>

        <wishing-tab-bar :current="3" theme="gray"></wishing-tab-bar>
    </view>
</template>

<script>
import { getUserSysMsg } from '../../api/apis.js';
import { showErrorMsg } from '../../utils/util.js';
import { getsetOpenid } from '../../utils/api-until.js';
const app = getApp();
export default {
    data() {
        return {
            loading: true,
            mseeages: [],

            message: {
                size: 0
            }
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {},
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.messagsInit();
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
        onclick(e) {
            var currIndex = e.currentTarget.id;
            const curr = app.globalData.messageTag + currIndex;
            let that = this;
            let value = that.mseeages[currIndex];
            uni.setStorageSync(curr, value);
        },

        messagsInit() {
            let that = this;
            getsetOpenid().then((opid) => {
                if (!opid) {
                    showErrorMsg('未获取到用户信息');
                    setTimeout(function () {
                        uni.navigateBack();
                    }, '2000');
                    return;
                }
                getUserSysMsg({
                    openid: opid
                })
                    .then((data) => {
                        console.log(data);
                        that.setData({
                            mseeages: data,
                            loading: false
                        });
                    })
                    .catch((err) => {
                        that.setData({
                            loading: false
                        });
                    });
            });
        }
    }
};
</script>
<style lang="scss">
.message-content {
    padding: 0 40rpx;

    .message-item {
        display: flex;
        /*	justify-content: space-between;*/
        margin-top: 42rpx;

        .msg-text {
            width: 650rpx;
            margin-left: 20rpx;
            text-align: justify;
            /*display: flex;*/
            flex-direction: column;
            justify-content: space-between;

            .info {
                display: flex;
                height: 38rpx;
                justify-content: space-between;
                margin: 8rpx;
                .type {
                    height: 100%;
                    color: #313131;
                    font-weight: bold;
                    font-size: 30rpx;
                }

                .date {
                    height: 100%;
                    font-size: 22rpx;
                    font-weight: 400;
                    color: #d1d1d1;
                    margin-left: 16rpx;
                    justify-content: center;
                    align-items: center;
                    display: flex;
                }
            }

            .msg {
                width: 100%;
                max-width: 550rpx;
                font-weight: 400;
                color: #616161;
                font-size: 22rpx;
                text-align: left;
                padding-left: 4rpx;
                /*justify-content: space-between;*/
            }
        }

        .pic {
            width: 96rpx;
            height: 96rpx;

            .img {
                width: 100%;
                height: 100%;
                border-radius: 20rpx;
            }
        }
    }
}
</style>
