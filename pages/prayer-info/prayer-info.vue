<template>
    <view>
        <!-- <wishing-bg></wishing-bg> -->
        <wishing-navigation theme="pink" :showBack="true" :showShadow="false"></wishing-navigation>

        <view class="body tab-bar-body">
            <view class="prayer-bg" :style="'height: ' + height + ' ; width: 100%;'">
                <view class="view-center" style="height: 180rpx; font-size: 32rpx; color: #ee1c54; font-weight: bold; line-height: 50rpx">
                    <view>
                        <text>您已填好心愿，心念所求，心诚则灵</text>
                    </view>
                    <view>
                        <text>祝您梦想成真！</text>
                    </view>
                </view>

                <scroll-view :enhanced="true" :show-scrollbar="false" scroll-y class="prayer-content">
                    <!-- 
			<view class="bg1 view-center">
				<view class="bg2 view-center">
					<view class="info view-center">
						<view style="font-size: 24rpx;color: gray;">编号：{{prayerNo}}</view>
						<view style="font-size: 24rpx;color: gray;margin-top: 40rpx;">{{name}}</view>
						<view style="font-size: 24rpx;color: gray;">{{prayerDate}}</view>
						<view class="detail">{{detail}}</view>
					</view>
					<view  class="img  view-center text-center">
						<image style="width: 600rpx;height: 600rpx;" src="/images/flower_high_light.png" mode="aspectFit" />
					</view>
				</view>
			</view> -->

                    <view class="bg1 text-center">
                        <view class="bg2">
                            <view class="display-center" style="margin-top: 30rpx">
                                <view style="margin: 0 auto; font-size: 24rpx; color: gray">编号：{{ prayerNo }}</view>
                            </view>

                            <view class="display-center" style="margin-top: 30rpx">
                                <view style="font-size: 24rpx; color: gray">{{ name }}</view>
                            </view>
                            <view class="display-center" style="margin-top: 10rpx">
                                <view style="font-size: 24rpx; color: gray">{{ prayerDate }}</view>
                            </view>
                            <view class="display-center view-center" style="margin-top: 30rpx; height: 400rpx">
                                <view class="detail" v-if="open">{{ detail }}</view>
                                <view class="detail" v-else>私密内容只有许愿者能看哦</view>
                            </view>
                            <view class="display-center view-center">
                                <image
                                    style="width: 600rpx; height: 600rpx; position: absolute; z-index: 9; margin-top: 100rpx"
                                    src="/static/images/flower_high_light.png"
                                    mode="aspectFit"
                                />
                            </view>
                        </view>
                    </view>

                    <view style="">
                        <!-- <image class="img" src="/images/flower_high_light.png" mode="aspectFit" /> -->

                        <view class="view-center" style="width: 100%">
                            <view :class="'redeem-medium ' + (mediumSize < 2 ? 'view-center' : '')" style="width: 580rpx; padding-bottom: 40rpx">
                                <view class="medium" v-if="imgUrl" @tap="previewImage" :data-url="imgUrl">
                                    <image :src="imgUrl" mode="aspectFit" style="height: 100%; width: 100%" />
                                </view>

                                <view class="medium view-center" v-if="voiceUrl" @tap="playOrStop" style="z-index: 19">
                                    <image v-if="playStatus" style="width: 70rpx; height: 70rpx" src="/static/images/icons/stop.png" mode="aspectFit" />

                                    <image v-if="!playStatus" style="width: 70rpx; height: 70rpx" src="/static/images/icons/play.png" mode="aspectFit" />
                                </view>
                            </view>

                            <view class="redeem-medium" style="width: 510rpx; height: 110rpx" v-if="prayerOpenId == openId">
                                <view class="prayer-redeem text-center" @tap="redeem">还愿</view>

                                <view class="share">
                                    <view class="prayer-share text-center shareView">分享</view>
                                    <button open-type="share" class="shareButton">1</button>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- <view>
				<image class="bg3" src="/images/bg3.png" mode="aspectFill" />
			</view> -->
                </scroll-view>
            </view>
        </view>

        <wishing-tab-bar :current="1" theme="pink"></wishing-tab-bar>
        <!-- <wishing-tab-bar current="1" theme="index"></wishing-tab-bar> -->
    </view>
</template>

<script>
import { getPrayerByNo } from '../../api/apis.js';
import { getFullUrl, showErrorMsg, formatDateStr } from '../../utils/util';
import { getsetOpenid } from '../../utils/api-until.js';
export default {
    data() {
        return {
            height: '92vh',
            //默认全屏的百分之92%高度
            prayerNo: '',
            detail: '',
            open: 'N',
            prayerDate: '',
            imgUrl: '',
            voiceUrl: '',
            name: '',
            mediumSize: 0,
            playStatus: false,
            prayerOpenId: '-1',
            //防止一开始 prayerOpenId == openId
            openId: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {
        let that = this;
        var barInfo = uni.getStorageSync('barInfo'); //获取缓存中的高度
        this.setData({
            height: barInfo ? barInfo.fullViewHeight - barInfo.tabBarHeight - 90 + 'px' : this.height,
            //计算全屏高度 180为上部标题
            prayerNo: options.prayerNo
        });
        this.audioPlay = uni.createInnerAudioContext();
        this.audioPlay.onPlay(() => {
            console.log('开始播放');
            that.setData({
                playStatus: true
            });
        });
        this.audioPlay.onEnded(() => {
            console.log('播放完毕');
            that.setData({
                playStatus: false
            });
        });
        this.audioPlay.onStop((res) => {
            console.log('播放停止', res);
            that.setData({
                playStatus: false
            });
        });
        this.audioPlay.onError((res) => {
            console.log('播放停止异常', res);
            that.setData({
                playStatus: false
            });
        });
        this.audioPlay.onPause((res) => {
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
    onShareAppMessage() {
        return {
            title: '祈愿',
            path: 'pages/prayer-info/prayer-info?prayerNo=' + this.prayerNo
        };
    },
    methods: {
        init() {
            let that = this;
            getPrayerByNo({
                prayerNo: this.prayerNo
            }).then((data) => {
                console.info(data);
                if (data.length > 0) {
                    let mediumSize = 0;
                    let voiceUrl = data[0].voice_url;
                    let imgUrl = data[0].img_url;
                    if (!!voiceUrl) {
                        voiceUrl = getFullUrl(voiceUrl);
                        mediumSize = mediumSize + 1;
                    }
                    if (!!imgUrl) {
                        imgUrl = getFullUrl(imgUrl);
                        mediumSize = mediumSize + 1;
                    }
                    that.setData({
                        detail: data[0].detail,
                        prayerDate: formatDateStr(data[0].prayer_date, false),
                        imgUrl: imgUrl,
                        voiceUrl: voiceUrl,
                        name: data[0].name,
                        mediumSize: mediumSize,
                        prayerOpenId: data[0].open_id,
                        open: data[0].open
                    });
                }
            });
            getsetOpenid().then((openId) => {
                this.setData({
                    openId: openId
                });
            });
        },

        redeem() {
            uni.navigateTo({
                url: '/pages/redeem/redeem?prayerNo=' + this.prayerNo
            });
        },

        //播放声音
        play: function () {
            if (!!this.voiceUrl) {
                this.audioPlay.src = this.voiceUrl;
                this.audioPlay.stop();
                this.audioPlay.play();
            }
        },

        stopPlay() {
            if (this.playStatus) {
                this.audioPlay.stop();
            }
        },

        playOrStop() {
            console.info('playOrStop');
            if (this.playStatus) {
                this.stopPlay();
            } else {
                this.play();
            }
        },

        previewImage: function (event) {
            uni.previewImage({
                urls: [event.currentTarget.dataset.url],
                //当前图片地址
                success: function (res) {
                    console.log('预览图片成功！');
                },
                fail: function (res) {
                    console.log('预览图片失败！');
                }
            });
        }
    }
};
</script>
<style lang="scss">
Page {
    background: -webkit-linear-gradient(top, #c4b0f7, #c4b0f7, #fbdee3, var(--themeColor_pink));
}

.prayer-bg {
    padding: 0rpx 40rpx;
}

.prayer-content {
    margin: 0 rpx 0rpx 4rpx 0;
    height: 100%;
    border: 2rpx solid #ffffff;
    background: #ffffff;
    box-shadow: 40rpx 40rpx 80rpx 20rpx rgba(255, 212, 235, 0.7) inset;
    border-radius: 40rpx;

    overflow: hidden;
}

.bg1 {
    display: relative;
    flex-direction: column;
    align-items: center;
    height: 850rpx;
    width: 100%;
}
/*背景圆*/
.bg2 {
    width: 180%;
    height: 800rpx;
    position: absolute;
    z-index: 1;
    /*	left: -40%;*/
    top: 0;
    border-radius: 0 0 50% 50%;
    /*background-color: red;*/
    background: -webkit-linear-gradient(top, #fcf5f5, #ffe7e2, #ffcee3, #ffd8be);
}

.display-center {
    display: flex;
    justify-content: center;
}
.detail {
    /*	height: 500rpx ;*/
    width: 550rpx;
    text-align: center;
    font-size: 30rpx;
    color: #e11d4d;
    font-weight: bold;
    padding: 40rpx 10rpx;
    z-index: 11;
}

.info {
    padding: 40rpx 24rpx;
    z-index: 11;
    position: relative;
    /*top: 200rpx;*/
}
.img {
    position: relative;
    top: -300rpx;

    z-index: 10;
}

.bg3 {
    width: 100%;
    height: 600rpx;
    position: relative;
    top: -320rpx;

    z-index: 9;
}

.redeem-medium {
    display: flex;
    justify-content: space-between;

    .prayer-redeem {
        width: 220rpx;
        height: 72rpx;
        border-radius: 46rpx;
        background-color: #e11d4d;
        color: #ffffff;
        box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(255, 212, 235, 0.7) inset;
        z-index: 20;
    }

    .prayer-share {
        width: 220rpx;
        height: 72rpx;
        border-radius: 46rpx;
        border: 2rpx solid #e11d4d;
        color: #e11d4d;
        z-index: 20;
    }

    .medium {
        width: 280rpx;
        height: 200rpx;
        border: 2rpx solid #e11d4d;
        border-radius: 20rpx;
        overflow: hidden;
    }
}

.share {
    position: relative;
}

.shareButton {
    top: -80rpx;
    opacity: 0;
    z-index: 20;
}

.shareView {
    opacity: 1;
}
</style>
