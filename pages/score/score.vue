<template>
    <view>
        <wishing-bg src="/static/images/pool_bg.png"></wishing-bg>

        <wishing-navigation theme="pool" :showBack="true" :showShadow="false"></wishing-navigation>

        <view class="scoreContent view-center">
            <view class="tips">
                <view>1.登后每天可最多积{{ maxPreDay }}分，100分=1元</view>
                <view>2.积分可抵扣许愿金额，限强烈心愿/置顶心愿</view>
            </view>

            <view style="margin-top: 40rpx; font-size: 26rpx; color: #ffffff">我的积分</view>
            <view style="margin-top: 10rpx; font-size: 72rpx; color: #ffffff">{{ currentScore }}</view>

            <!-- 
	<button type="primary" open-type="chooseAvatar" bindchooseavatar="getChooseAvatar" >获取头像</button>

	<form bindsubmit="userInfoLogin"><input name="nickname" type="nickname" class="calculate-input" placeholder="请输入昵称" value="{{nickName}}"   /><button class="move-anim-box weight-save" type="primary" form-type="submit">保存</button></form> -->

            <view style="margin-top: 200rpx" class="view-center">
                <view :animation="textAnimation0" class="floatbox">
                    <text>积分+1</text>
                </view>
                <view :animation="textAnimation1" class="floatbox">
                    <text>积分+1</text>
                </view>
                <view :animation="textAnimation2" class="floatbox">
                    <text>积分+1</text>
                </view>
                <view :animation="textAnimation3" class="floatbox">
                    <text>积分+1</text>
                </view>
                <view :animation="textAnimation4" class="floatbox">
                    <text>积分+1</text>
                </view>

                <view class="" style="position: relative; width: 750rpx">
                    <view class="" style="margin-top: 0rpx; z-index: 8; position: absolute; width: 750rpx">
                        <view :animation="waveAnimation0" class="wave bolang"></view>
                        <view :animation="waveAnimation1" class="wave bolang"></view>
                        <view :animation="waveAnimation2" class="wave bolang"></view>
                        <view :animation="waveAnimation3" class="wave bolang"></view>
                        <view :animation="waveAnimation4" class="wave bolang"></view>
                    </view>
                    <image
                        class="ttAnimation"
                        @tap="addScore"
                        style="width: 650rpx; height: 500rpx; z-index: 11; position: absolute; left: 50rpx"
                        :data-src="topUrl"
                        :src="topUrl"
                        mode="aspectFit"
                    />
                    <image @tap="addScore" style="width: 650rpx; height: 500rpx; z-index: 5; position: absolute; left: 50rpx" :data-src="footUrl" :src="footUrl" mode="aspectFit" />
                </view>
            </view>

            <!-- 
	<view style="margin-top: 200rpx; display: flex;margin-bottom: 100rpx;">
		<view class="scoreBtn text-center" bindtap="gotoPrayer">我要许愿</view>
		<view class="scoreBtn share">
			<view class="text-center shareView">分享</view>
			<button  style="width: 180rpx;height: 72rpx; " open-type="share" class="shareButton">1</button>
		</view>
	
	</view> -->
        </view>

        <view style="position: fixed; bottom: 80rpx; left: 180rpx">
            <view style="display: flex; justify-content: center">
                <view class="scoreBtn text-center" @tap="gotoPrayer">我要许愿</view>
                <view class="scoreBtn share">
                    <view class="text-center shareView">分享</view>
                    <button style="width: 180rpx; height: 72rpx" open-type="share" class="shareButton">1</button>
                </view>
            </view>
        </view>

        <!-- 水波效果 -->
        <!-- <view style="position: fixed;bottom: 450rpx;left: 30rpx;" class="wave bolang1 animation2"></view> 

<view style="position: fixed;bottom: 400rpx;right: 160rpx;" class="wave bolang1 animation1"></view> 

<view style="position: fixed; bottom: 300rpx; left: 150rpx;"  class="wave bolang2 animation2">
	<view  class="wave "></view>
</view> 

<view style="position: fixed; bottom: 500rpx; right:50rpx;"  class="wave bolang2 animation3">
	<view  class="wave "></view>
</view>  -->
    </view>
</template>

<script>
import { getsetOpenid } from '../../utils/api-until.js';
import { showErrorMsg } from '../../utils/util';
import { getUserScore, saveScore } from '../../api/apis.js';
import { getFullUrl } from '../../utils/util';
// #ifdef MP-WEIXIN
this.$scope.animate(
    '.ttAnimation',
    [
        {
            opacity: 1
        },
        //第一个不能去掉
        {
            translateY: '10px',
            scale: [0.95, 0.95],
            opacity: 1,
            offset: 0.85
        }
    ],
    100,
    function () {
        //动画结束的回调
        this.clearAnimation('.ttAnimation', function () {});
    }.bind(this)
);
// #endif
// #ifndef MP-WEIXIN
export default {
    data() {
        return {
            textAnimation0: '',
            textAnimation1: '',
            textAnimation2: '',
            textAnimation3: '',
            textAnimation4: '',
            currentAnimation: 0,
            openId: '',
            addedScore: 0,
            addingScore: 0,
            currentScore: 0,
            maxPreDay: 0,
            adding: false,
            waveAnimation0: '',
            waveAnimation1: '',
            waveAnimation2: '',
            waveAnimation3: '',
            waveAnimation4: '',
            ttAnimation: '',
            topUrl: '',
            footUrl: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {
        this.textAnimation0 = uni.createAnimation({
            delay: 0,
            // duration:500,
            // timingFunction:'linear',
            duration: 1000,
            timingFunction: 'ease-out',
            transformOrigin: '50% 50%'
        });
        this.textAnimation1 = uni.createAnimation({
            delay: 0,
            // duration:500,
            // timingFunction:'linear',
            duration: 1000,
            timingFunction: 'ease-out',
            transformOrigin: '50% 50%'
        });
        this.textAnimation2 = uni.createAnimation({
            delay: 0,
            // duration:500,
            // timingFunction:'linear',
            duration: 1000,
            timingFunction: 'ease-out',
            transformOrigin: '50% 50%'
        });
        this.textAnimation3 = uni.createAnimation({
            delay: 0,
            // duration:500,
            // timingFunction:'linear',
            duration: 1000,
            timingFunction: 'ease-out',
            transformOrigin: '50% 50%'
        });
        this.textAnimation4 = uni.createAnimation({
            delay: 0,
            // duration:500,
            // timingFunction:'linear',
            duration: 1000,
            timingFunction: 'ease-out',
            transformOrigin: '50% 50%'
        });
        this.waveAnimation0 = uni.createAnimation({
            delay: 0,
            duration: 1000,
            timingFunction: 'linear',
            transformOrigin: '50% 50%'
        });
        this.waveAnimation1 = uni.createAnimation({
            delay: 0,
            duration: 1000,
            timingFunction: 'linear',
            transformOrigin: '50% 50%'
        });
        this.waveAnimation2 = uni.createAnimation({
            delay: 0,
            duration: 1000,
            timingFunction: 'linear',
            transformOrigin: '50% 50%'
        });
        this.waveAnimation3 = uni.createAnimation({
            delay: 0,
            duration: 1000,
            timingFunction: 'linear',
            transformOrigin: '50% 50%'
        });
        this.waveAnimation4 = uni.createAnimation({
            delay: 0,
            duration: 1000,
            timingFunction: 'linear',
            transformOrigin: '50% 50%'
        });

        // 音乐
        this.music = uni.createInnerAudioContext({
            useWebAudioImplement: true
        });
        this.music.src = '/static/images/damuyu.mp3';
        this.setData({
            topUrl: getFullUrl('/attachment/business/tt_top.png'),
            footUrl: getFullUrl('/attachment/business/tt_foot.png')
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
    onHide() {
        console.info('onHide');
        this.save();
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        console.info('onUnload');
        this.save();
    },
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
            title: '祈愿积分',
            path: '/pages/score/score'
        };
    },
    methods: {
        init() {
            let that = this;
            getsetOpenid().then((openId) => {
                that.setData({
                    openId: openId
                });
                getUserScore({
                    openId: openId
                }).then((data) => {
                    console.info(data);
                    if (data.length > 0) {
                        that.setData({
                            addedScore: data[0].addedScore,
                            currentScore: data[0].currentScore,
                            maxPreDay: data[0].maxPreDay
                        });
                    }
                });
            });
        },

        // getChooseAvatar(e) {
        //   console.log(e);

        // },
        // userInfoLogin(e) {console.log(e);},

        addScore: function (event) {
            if (!this.openId || this.adding) {
                return;
            }
            let addingScore = this.addingScore + 1;
            let currentScore = this.currentScore + 1;
            if (addingScore + this.addedScore > this.maxPreDay) {
                showErrorMsg('当日积分已达上限');
                return;
            }
            let textAnimation = '';
            let waveAnimation = '';
            let currentAnimation = (this.currentAnimation + 1) % 5;
            if (currentAnimation == 0) {
                textAnimation = this.textAnimation0;
                waveAnimation = this.waveAnimation0;
            } else if (currentAnimation == 1) {
                textAnimation = this.textAnimation1;
                waveAnimation = this.waveAnimation1;
            } else if (currentAnimation == 2) {
                textAnimation = this.textAnimation2;
                waveAnimation = this.waveAnimation2;
            } else if (currentAnimation == 3) {
                textAnimation = this.textAnimation3;
                waveAnimation = this.waveAnimation3;
            } else {
                textAnimation = this.textAnimation4;
                waveAnimation = this.waveAnimation4;
            }

            // 动画
            textAnimation.opacity(1).step({
                duration: 10
            });
            textAnimation.translateY(-50).opacity(0).scale(1.8).step({
                duration: 900
            });
            textAnimation.translateY(0).scale(1).step({
                duration: 10
            });
            waveAnimation.opacity(1).step({
                duration: 10
            });
            waveAnimation.opacity(0).scale(6.5).step({
                duration: 900
            });
            waveAnimation.opacity(0).scale(1).step({
                duration: 10
            });
            this.music.stop();
            this.music.play();
            if (currentAnimation == 0) {
                this.setData({
                    textAnimation0: textAnimation.export(),
                    waveAnimation0: waveAnimation.export()
                });
            } else if (currentAnimation == 1) {
                this.setData({
                    textAnimation1: textAnimation.export(),
                    waveAnimation1: waveAnimation.export()
                });
            } else if (currentAnimation == 2) {
                this.setData({
                    textAnimation2: textAnimation.export(),
                    waveAnimation2: waveAnimation.export()
                });
            } else if (currentAnimation == 3) {
                this.setData({
                    textAnimation3: textAnimation.export(),
                    waveAnimation3: waveAnimation.export()
                });
            } else {
                this.setData({
                    textAnimation4: textAnimation.export(),
                    waveAnimation4: waveAnimation.export()
                });
            }
            //乌龟缩小动画
            var fbg0 = this.animate(
                '.ttAnimation',
                [
                    {
                        opacity: 1
                    },
                    //第一个不能去掉
                    {
                        translateY: '10px',
                        scale: [0.95, 0.95],
                        opacity: 1,
                        offset: 0.85
                    }
                ],
                100,
                function () {
                    //动画结束的回调
                    this.clearAnimation('.ttAnimation', function () {});
                }.bind(this)
            );

            // 数据更新
            this.setData({
                currentAnimation: currentAnimation,
                currentScore: currentScore,
                addingScore: addingScore,
                adding: true
            });
            //  0.2s只能点一次
            setTimeout(() => {
                this.setData({
                    adding: false
                });
            }, 200);
        },

        save() {
            if (!this.openId || this.addingScore < 1) {
                return;
            }
            let score = this.addingScore;
            //防止二次保存
            this.setData({
                addingScore: 0,
                addedScore: this.addedScore + score
            });
            saveScore({
                openId: this.openId,
                score: score
            });
        },

        gotoPrayer() {
            uni.navigateTo({
                url: '/pages/prayer-choose/prayer-choose'
            });
        }
    }
};
// #endif
</script>
<style lang="scss">
/* pages/score/score.wxss */
.scoreContent {
    .tips {
        width: 590rpx;
        height: 106rpx;
        border-radius: 20rpx;
        background-color: #ffffff;
        margin-top: 20rpx;
        padding: 20rpx 68rpx;
        font-size: 22rpx;
        line-height: 36rpx;
    }
}

.scoreBtn {
    width: 184rpx;
    height: 72rpx;
    border-radius: 46rpx;
    font-size: 26rpx;
    background-color: #0278d0;
    color: #ffffff;
    border: 1rpx solid #ffffff;
    border-bottom: 4rpx solid #ffffff;
    box-shadow: 4rpx 4rpx 8rpx 2rpx rgba(255, 255, 255, 0.7) inset;
    margin: 0rpx 10rpx;
}

.floatbox {
    position: absolute;
    color: white;
    font-size: 40rpx;
    top: 600rpx;
    opacity: 0;
}

.share {
    position: relative;
}

.shareButton {
    top: -72rpx;
    opacity: 0;
}

.shareView {
    opacity: 1;
    height: 72rpx;
}

.wave {
    border-radius: 50%;
    border: 4rpx solid rgb(193, 222, 255);
    /*margin-top: 80rpx;*/
}
.bolang {
    width: 300rpx;
    height: 80rpx;
    margin: 0 auto;
    position: absolute;
    opacity: 0;
    z-index: 10;
    left: 220rpx;
    top: 250rpx;
}
</style>
