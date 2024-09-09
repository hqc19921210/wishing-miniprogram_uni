<template>
    <view>
        <!-- pages/mine/mine.wxml -->
        <wishing-navigation theme="gray" :showBack="false"></wishing-navigation>
        <van-row class="mine-row-first">
            <van-col span="12" offset="4">
                <view>
                    <van-image @click="gotoInfo" width="128rpx" height="128rpx" fit="fill" src="/static/images/icons/mine-info.png" />
                    <text class="mine-text" @tap="gotoInfo">我的信息</text>
                </view>
            </van-col>
            <van-col span="8">
                <view>
                    <van-image @click="gotoMyPrayer" width="128rpx" height="128rpx" fit="fill" src="/static/images/icons/mine-prayer.png" />
                    <text class="mine-text">我的愿望</text>
                </view>
            </van-col>
        </van-row>
        <van-row class="mine-row-first">
            <van-col offset="10">
                <view>
                    <van-image @click="gotoScore" width="128rpx" height="128rpx" fit="fill" src="/static/images/icons/mine-score.png" />
                    <text class="mine-text">我的积分</text>
                </view>
            </van-col>
        </van-row>
        <van-row>
            <van-col span="12" offset="4">
                <view>
                    <van-image @click="gotoCollect" width="128rpx" height="128rpx" fit="fill" src="/static/images/icons/mine-collect.png" />
                    <text class="mine-text">我的收藏</text>
                </view>
            </van-col>
            <van-col span="8">
                <view style="position: relative">
                    <van-image @click="gotoMessage" width="128rpx" height="128rpx" fit="fill" src="/static/images/icons/mine-message.png" />
                    <text class="mine-text">我的消息</text>
                    <view v-if="unread > 0" class="van-info">{{ unread }}</view>
                </view>
            </van-col>
        </van-row>
        <view class="qrcode">
            <image @tap="previewImage" :data-src="qrcodeUrl" style="width: 260rpx; height: 260rpx" mode="aspectFit" :src="qrcodeUrl" />
            <text class="qrcode-text">联系我们</text>
        </view>

        <wishing-tab-bar :current="3" theme="gray"></wishing-tab-bar>
    </view>
</template>

<script>
// pages/mine/mine.js
import { getsetOpenid } from '../../utils/api-until.js';
import { preOrder, getUnread } from '../../api/apis.js';
import { getFullUrl } from '../../utils/util';
export default {
    data() {
        return {
            openid: '',
            qrcodeUrl: '',
            unread: 0
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {
        this.setData({
            qrcodeUrl: getFullUrl('/attachment/business/qrcode.png')
        });
        this.mineLogin();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.mineGetUnread();
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
        mineLogin() {
            getsetOpenid().then((data) => {
                this.setData({
                    openid: data
                });
                console.log('异步' + data);
            });
            console.log('mineLogin：' + this.openid);
            //同步获取,需要Storage有值，且import不执行wx.getStorageSync
            let opid = uni.getStorageSync('openid');
            console.log('mineLogin：' + opid);
        },

        mineGetUnread() {
            getUnread({
                openId: this.openid
            }).then((data) => {
                var rs = data[0];
                this.setData({
                    unread: rs.unread > 99 ? '99+' : rs.unread
                });
                console.log('unread', rs.unread);
            });
        },

        gotoScore() {
            uni.navigateTo({
                url: '/pages/score/score'
            });
        },

        gotoMyPrayer() {
            uni.navigateTo({
                url: '/pages/my-prayer/my-prayer'
            });
        },

        gotoInfo() {
            uni.navigateTo({
                url: '/pages/mine-info/mine-info'
            });
        },

        gotoMessage() {
            uni.navigateTo({
                url: '/pages/message-list/message-list'
            });
        },

        gotoCollect() {
            uni.navigateTo({
                url: '/pages/collect/collect'
            });
        },

        previewImage: function (event) {
            console.info(event);
            uni.previewImage({
                urls: [event.currentTarget.dataset.src],
                //当前图片地址
                success: function (res) {
                    console.log('预览图片成功！');
                },
                fail: function (res) {
                    console.log('预览图片失败！');
                }
            });
        },

        payTest() {
            preOrder({
                id: 11
            })
                .then((data) => {
                    console.log(data);
                    var per = data[0];
                    if (!per.packageVal) {
                        console.log('预付单建立失败，检查后台');
                        return;
                    }
                    per.package = per.packageVal;
                    per.success = function (res) {
                        console.log(res);
                    };
                    per.fail = function (res) {
                        console.log(res);
                    };
                    uni.requestPayment(per);
                })
                .catch((err) => {
                    console.log('预付单建立失败，检查后台');
                    console.log(err);
                });
        }
    }
};
</script>
<style lang="scss">
/* pages/mine/mine.wxss */
.mine-row-first {
    padding-left: 104rpx;
}
.mine-text {
    position: relative;
    left: -115rpx;
    text-align: left;
    font-size: 26rpx;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #616161;
}
.qrcode {
    margin-left: 236rpx;
    margin-top: 132rpx;
    padding: 10rpx;
    width: 280rpx;
    height: 366rpx;
    background: #ffffff;
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    opacity: 1;
    border: 2rpx solid #b5b5b5;
}
.qrcode-text {
    position: relative;
    left: 78rpx;
    font-size: 26rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #313131;
}
.van-info {
    position: absolute;
    top: 20rpx;
    left: 80rpx;
    box-sizing: border-box;
    min-width: 16px;
    padding: 0 3px;
    color: #fff;
    font-weight: 500;
    font-size: 12px;
    font-family: -apple-system-font, Helvetica Neue, Arial, sans-serif;
    line-height: 1.2;
    text-align: center;
    background-color: #ee0a24;
    border: 1px solid #fff;
    border-radius: 16px;
    -webkit-transform: translate(50%, -50%);
    transform: translate(50%, -50%);
    -webkit-transform-origin: 100%;
    transform-origin: 100%;
}
</style>
