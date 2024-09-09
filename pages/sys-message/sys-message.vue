<template>
    <view>
        <wishing-navigation theme="gray" title="系统消息" :showBack="true"></wishing-navigation>

        <view class="body tab-bar-body">
            <view class="sys-message">
                <view class="text">
                    <view class="info">
                        <view class="type">
                            <text v-if="context.system_msg == 1">系统消息</text>
                            <text v-if="context.system_msg == 2">管理员回复</text>
                        </view>
                        <view class="date">
                            <text>{{ context.update_date }}</text>
                        </view>
                    </view>
                    <view class="msg">{{ context.message }}</view>
                </view>
            </view>
        </view>

        <wishing-tab-bar :current="3" theme="gray"></wishing-tab-bar>
    </view>
</template>

<script>
// pages/sys-message/sys-message.js
import { showErrorMsg } from '../../utils/util.js';
import { userReadMsg } from '../../api/apis.js';
const app = getApp();
export default {
    data() {
        return {
            context: {
                system_msg: 0,
                update_date: '',
                message: ''
            },
            mstatus: 0,
            mid: 0
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {
        this.init(options.index);
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let id = this.mid;
        let mstatus = this.mstatus + '';
        if (!!id && mstatus == '0') {
            userReadMsg({
                id: id
            });
        }
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
        init(currId) {
            let that = this;
            const key = app.globalData.messageTag + currId;
            var curr = uni.getStorageSync(key);
            console.log(curr);
            if (!curr) {
                showErrorMsg('未获取到信息');
                setTimeout(function () {
                    uni.navigateBack();
                }, '2000');
                return;
            } else {
                that.setData({
                    context: curr,
                    mstatus: curr.status,
                    mid: curr.id
                });
            }
        }
    }
};
</script>
<style lang="scss">
.sys-message {
    padding: 72rpx 40rpx 0 40rpx;

    .text {
        background: #f5f5f5;
        border-radius: 20rpx 20rpx 20rpx 20rpx;
        width: 670rpx;
        padding: 32rpx 40rpx 40rpx 40rpx;

        text-align: justify;
        /*display: flex;*/
        flex-direction: column;
        justify-content: space-between;

        .info {
            display: flex;
            height: 48rpx;
            justify-content: space-between;

            .type {
                height: 100%;
                color: #313131;
                font-weight: bold;
                font-size: 34rpx;
            }

            .date {
                height: 100%;
                font-size: 22rpx;
                font-weight: 400;
                color: #b5b5b5;
                margin-left: 16rpx;
                justify-content: center;
                align-items: center;
                display: flex;
            }
        }

        .msg {
            font-weight: 400;
            color: #313131;
            font-size: 30rpx;
            text-align: left;
            margin-top: 20rpx;
            line-height: 48rpx;
            letter-spacing: 1rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            word-break: break-word;
        }
    }
}
</style>
