<template>
    <view>
        <wishing-navigation theme="blue" :showBack="false" :showShadow="false"></wishing-navigation>

        <view class="body tab-bar-body">
            <view class="ass-bg" :style="'height: ' + height + ' ; width: 100%;'">
                <scroll-view :scroll-y="true" class="content" :scroll-into-view="viewId">
                    <view class="text-center" style="margin-bottom: 100rpx; margin-top: 40rpx">
                        <navigator class="button-view" url="/pages/article/article">文章</navigator>
                    </view>

                    <view :id="'msg' + index" v-for="(item, index) in msgList" :key="index">
                        <view class="ass-msg-sys" v-if="item.systemMsg">
                            <view class="head">
                                <image style="width: 100%; height: 100%" src="/static/images/assistant_head.png" mode="aspectFill" />
                            </view>
                            <view class="text text-center">
                                <text>{{ item.text }}</text>
                            </view>
                        </view>

                        <view class="ass-msg-user" style="margin-top: 42rpx; position: relative" v-else>
                            <view class="text text-center">
                                <textarea :disabled="true" name="textdata" :value="item.text" :auto-height="true" style="height: 100%" />
                            </view>
                            <view class="head">
                                <image style="width: 100rpx; height: 100rpx; border-radius: 50%; margin-right: 28rpx; margin-top: 25rpx" :src="imgUrl" mode="aspectFill" />
                            </view>
                        </view>
                    </view>

                    <view id="planInput" v-if="showInput" class="ass-msg-user" style="margin-top: 42rpx; position: relative; margin-bottom: 20rpx">
                        <view class="text text-center" style="position: relative; right: 130rpx; min-height: 150rpx; text-align: start">
                            <textarea
                                name="textdata"
                                placeholder="请输入您的计划"
                                v-model="msg"
                                :auto-height="true"
                                style="height: 100%; padding: 0 10rpx"
                                @input="sendDataByEnter"
                                confirm-type="done"
                                @confirm="sendDataByConfirm"
                            />
                        </view>
                        <view class="" style="position: absolute; bottom: 0rpx">
                            <image style="width: 100rpx; height: 100rpx; border-radius: 50%; margin-right: 28rpx" :src="imgUrl" mode="aspectFill" />
                        </view>
                    </view>

                    <view style="width: 100%; height: 30rpx"></view>
                </scroll-view>
            </view>
        </view>

        <wishing-tab-bar :current="2" theme="blue"></wishing-tab-bar>
    </view>
</template>

<script>
// pages/assistant/assistant.js
import { saveUserMessage } from '../../api/apis.js';
import { showErrorMsg, filterEmoji } from '../../utils/util.js';
import { getsetOpenid } from '../../utils/api-until.js';
export default {
    data() {
        return {
            height: '92vh',
            //默认全屏的百分之92%高度
            msgList: [],
            msg: '',
            imgUrl: '',
            adding: false,
            viewId: '',
            showInput: false
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {
        var barInfo = uni.getStorageSync('barInfo'); //获取缓存中的高度
        this.setData({
            height: barInfo ? barInfo.fullViewHeight - barInfo.tabBarHeight + 'px' : this.height,
            //计算全屏高度 160rpx为底部导航栏高度
            msgList: [],
            showInput: false
        });
        setTimeout(() => {
            this.msgList.push({
                systemMsg: true,
                text: '请告诉我们\n您打算如何实现您的愿望?'
            });
            this.setData({
                msgList: this.msgList
            });
        }, 1000);
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        var userinfo = uni.getStorageSync('userinfo'); //获取缓存中的高度
        var imgUrl = '/static/images/icons/defult-avatar.png';
        if (!!userinfo && !!userinfo.showAvatarUri) {
            imgUrl = userinfo.showAvatarUri;
        }
        this.setData({
            imgUrl: imgUrl,
            viewId: 'planInput'
        });
        setTimeout(() => {
            this.setData({
                showInput: true
            });
        }, 2000);
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
        sendDataByEnter(event) {
            // console.info("sendDataByEnter",event.detail)
            let c = event.detail.value.charAt(event.detail.cursor - 1);
            if (c == '\n') {
                //输入换行时发送
                let filter = filterEmoji(event.detail.value);
                this.sendMsg(filter);
            }
        },

        sendDataByConfirm(event) {
            let filter = filterEmoji(event.detail.value);
            this.sendMsg(filter);
        },

        sendMsg(msg) {
            let that = this;
            console.info(msg);
            getsetOpenid().then((opid) => {
                if (!opid) {
                    showErrorMsg('未获取到用户信息');
                    return;
                }
                that.setData({
                    viewId: ''
                });
                saveUserMessage({
                    openid: opid,
                    context: msg
                })
                    .then((data) => {
                        console.info(data);
                        that.msgList.push({
                            systemMsg: false,
                            text: msg
                        });
                        that.setData({
                            msgList: that.msgList,
                            msg: '',
                            showInput: false,
                            viewId: 'msg' + (that.msgList.length - 1)
                        });
                        if (that.adding) {
                            //防止一直发消息一直不停地自动回复
                            return;
                        }
                        that.setData({
                            adding: true
                        });
                        setTimeout(() => {
                            this.msgList.push({
                                systemMsg: true,
                                text: '我们已收到您的计划，3天内，我们会给您回复哦，请留意个人中心-我的消息。'
                            });
                            this.setData({
                                msgList: this.msgList,
                                viewId: 'msg' + (this.msgList.length - 1)
                            });
                        }, 1000);
                        setTimeout(() => {
                            this.msgList.push({
                                systemMsg: true,
                                text: '我们有一些资讯，希望可以帮到您。您对我们的服务有什么意见和建议，请给我们留言，我们将以真诚和用心的态度对待每一句留言，把祈愿池做得更好，真正服务到每一个需要的人。'
                            });
                            this.setData({
                                msgList: this.msgList,
                                viewId: 'msg' + (this.msgList.length - 1),
                                adding: false
                            });
                        }, 2000);
                        setTimeout(() => {
                            this.setData({
                                showInput: true,
                                viewId: 'planInput'
                            });
                        }, 3000);

                        //wx.navigateTo({url:"/pages/assistant-done/assistant-done"})
                    })
                    .catch((err) => {
                        showErrorMsg('提交计划失败请重试');
                    });
            });
        }
    }
};
</script>
<style lang="scss">
/* pages/assistant/assistant.wxss */

Page {
    background: var(--themeColor_blue);
}
.ass-bg {
    padding: 0rpx 40rpx;
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
    margin-top: 42rpx;
    position: relative;

    .head {
        width: 108rpx;
        height: 130rpx;

        margin-left: 40rpx;
        position: absolute;
        bottom: 0px;
    }

    .text {
        margin-left: 20rpx;
        background-color: #f5f5f5;
        border-radius: 40rpx 40rpx 40rpx 0;
        width: 370rpx;
        min-height: 144rpx;
        padding: 24rpx;
        font-size: 26rpx;
        position: relative;
        left: 140rpx;
    }
}

.ass-msg-user {
    display: flex;
    justify-content: flex-end;

    .head {
        width: 108rpx;
        height: 130rpx;

        margin-right: 28rpx;
        position: absolute;
        bottom: 0px;
    }

    .text {
        margin-right: 20rpx;
        background-color: #ebf5fd;
        border-radius: 40rpx 40rpx 0 40rpx;
        width: 370rpx;
        /*height: 144rpx;*/
        padding: 24rpx;
        font-size: 26rpx;
        position: relative;
        right: 130rpx;
        min-height: 150rpx;
        text-align: start;
    }
}
</style>
