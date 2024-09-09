<template>
    <view>
        <!-- <wishing-bg src="/images/bg.jpg"></wishing-bg> -->
        <view>
            <image class="bg" src="/static/images/pool_bg.png" mode="aspectFill"></image>
        </view>

        <view :style="' z-index: -8; position: fixed;top: ' + mountTop + ';'">
            <image style="width: 750rpx; height: 750rpx" src="/static/images/mount2.png" mode="aspectFill" />
        </view>

        <view class="index body tab-bar-body" id="bg">
            <!-- 背景 -->
            <view>
                <!--  -->
                <view :class="'flower_bg fbg' + index" v-for="(item, index) in 10" :key="index">
                    <image style="width: 100%; height: 100%" src="/static/images/pool_flower.png" mode="aspectFit" />
                </view>

                <!-- <view class="flower_bg fbg0" >
			<image style="width: 100%;height: 100%;" src="/images/pool_flower.png" mode="aspectFit"/>
		</view> -->
            </view>

            <!-- 置顶 -->
            <view class="flower-pool">
                <view
                    style="border-radius: 50%"
                    @tap="clickFlower"
                    :data-index="index"
                    :class="'flower-size flower' + index + ' flower-move-' + (index % 3)"
                    v-for="(item, index) in 10"
                    :key="index"
                >
                    <view v-if="topList[index]" style="position: absolute; top: 50rpx" class="name">{{ topList[index].name }}</view>

                    <image style="width: 100%; height: 100%" src="/static/images/pool_flower.png" mode="aspectFit" />
                </view>
            </view>

            <!-- 菜单 -->
            <view>
                <navigator url="/pages/prayer-choose/prayer-choose" class="menu" style="top: 200rpx">
                    <text class="need-text text-center">许愿</text>
                    <image class="need-bg view-center" src="/static/images/need.png" mode="aspectFit" />
                </navigator>

                <navigator url="/pages/prayer-pool/prayer-pool" class="menu" style="top: 320rpx">
                    <text class="need-text text-center">愿望池</text>
                    <image class="need-bg" src="/static/images/need.png" mode="aspectFit" />
                </navigator>

                <navigator url="/pages/redeem/redeem" class="menu" style="top: 440rpx">
                    <text class="need-text text-center">还愿</text>
                    <image class="need-bg" src="/static/images/need.png" mode="aspectFit" />
                </navigator>

                <navigator url="/pages/score/score" class="menu" style="top: 560rpx">
                    <text class="need-text text-center">我的积分</text>
                    <image class="need-bg" src="/static/images/need.png" mode="aspectFit" />
                </navigator>
            </view>
        </view>

        <wishing-tab-bar :current="0" theme="index" unSelectType="2"></wishing-tab-bar>
        <van-popup :show="show" @close="onClose" :lock-scroll="true" round>
            <view class="popupbg" style="width: 600rpx; min-height: 600rpx">
                <view class="view-center" style="padding: 0 40rpx; position: relative; z-index: 10">
                    <view class="no">编号：{{ choosed.prayer_no }}</view>
                    <view class="name">{{ choosed.name }}</view>
                    <view>{{ choosed.prayer_date }}</view>
                    <view class="detail text_hh" v-if="choosed.open == 'Y' || choosed.open_id == openId">{{ choosed.detail }}</view>
                    <view class="detail text_hh" v-else>私密内容只有许愿者能看哦</view>
                </view>

                <view style="width: 500rpx; height: 500rpx; margin: 0 auto; position: relative; z-index: 8; margin-top: -200rpx; margin-left: 70rpx">
                    <image style="width: 100%; height: 100%" src="/static/images/flower_high_light.png" mode="aspectFit" />
                </view>
            </view>
        </van-popup>
    </view>
</template>

<script>
import { getTopPrayer } from '../../api/apis.js';
import { getsetOpenid, compareVersion } from '../../utils/api-until.js';
import { showErrorMsg, formatDateStr } from '../../utils/util';
const version = uni.getAppBaseInfo().SDKVersion;
const bgdur = 17000;
// #ifdef MP-WEIXIN
this.$scope.animate(
    '.fbg0',
    [
        {
            opacity: 1
        },
        //第一个不能去掉
        {
            left: '250rpx',
            bottom: '900rpx',
            scale: [0.6, 0.6],
            opacity: 1,
            offset: 0.55
        },
        {
            left: '260rpx',
            bottom: '1000rpx',
            scale: [0.5, 0.5],
            opacity: 0.8,
            offset: 0.7
        },
        {
            bottom: '1150rpx',
            left: '80rpx',
            opacity: 0,
            scale: [0.2, 0.2],
            offset: 0.98
        }
    ],
    bgdur,
    function () {
        //动画结束的回调
        this.clearAnimation('.fbg0', function () {
            that.flowerBg();
        });
    }.bind(this)
);
// #endif
// #ifdef MP-WEIXIN
this.$scope.animate(
    '.fbg1',
    [
        {
            opacity: 1
        },
        //第一个不能去掉
        {
            bottom: '720rpx',
            left: '250rpx',
            opacity: 1,
            scale: [0.7, 0.7],
            offset: 0.5
        },
        {
            bottom: '860rpx',
            left: '350rpx',
            scale: [0.5, 0.5],
            opacity: 1,
            offset: 0.7
        },
        {
            bottom: '1180rpx',
            left: '150rpx',
            scale: [0.2, 0.2],
            opacity: 0,
            offset: 0.83
        }
    ],
    bgdur,
    function () {
        //动画结束的回调
        this.clearAnimation('.fbg1', function () {});
    }.bind(this)
);
// #endif
// #ifdef MP-WEIXIN
this.$scope.animate(
    '.fbg2',
    [
        {
            opacity: 1
        },
        //第一个不能去掉
        {
            bottom: '850rpx',
            left: '390rpx',
            opacity: 1,
            scale: [0.55, 0.55],
            offset: 0.5
        },
        {
            bottom: '1140rpx',
            left: '200rpx',
            scale: [0.2, 0.2],
            opacity: 0.2,
            offset: 0.78
        }
    ],
    bgdur,
    function () {
        //动画结束的回调
        this.clearAnimation('.fbg2', function () {});
    }.bind(this)
);
// #endif
// #ifdef MP-WEIXIN
this.$scope.animate(
    '.fbg3',
    [
        {
            opacity: 1
        },
        //第一个不能去掉
        {
            bottom: '820rpx',
            left: '460rpx',
            opacity: 1,
            scale: [0.6, 0.6],
            offset: 0.5
        },
        {
            bottom: '1100rpx',
            left: '230rpx',
            scale: [0.2, 0.2],
            opacity: 0.2,
            offset: 0.78
        }
    ],
    bgdur,
    function () {
        //动画结束的回调
        this.clearAnimation('.fbg3', function () {});
    }.bind(this)
);
// #endif
// #ifdef MP-WEIXIN
this.$scope.animate(
    '.fbg4',
    [
        {
            opacity: 1
        },
        //第一个不能去掉
        {
            bottom: '900rpx',
            left: '450rpx',
            opacity: 1,
            scale: [0.6, 0.6],
            offset: 0.7
        },
        {
            bottom: '1150rpx',
            left: '250rpx',
            scale: [0.2, 0.2],
            opacity: 0.2,
            offset: 0.98
        }
    ],
    bgdur,
    function () {
        //动画结束的回调
        this.clearAnimation('.fbg4', function () {});
    }.bind(this)
);
// #endif
// #ifdef MP-WEIXIN
this.$scope.animate(
    '.fbg5',
    [
        {
            opacity: 1
        },
        //第一个不能去掉
        {
            bottom: '950rpx',
            left: '425rpx',
            opacity: 1,
            scale: [0.6, 0.6],
            offset: 0.8
        },
        {
            bottom: '1110rpx',
            left: '280rpx',
            scale: [0.2, 0.2],
            opacity: 0.2,
            offset: 0.9
        }
    ],
    bgdur,
    function () {
        //动画结束的回调
        this.clearAnimation('.fbg5', function () {
            that.flowerBg2();
        });
    }.bind(this)
);
// #endif
// #ifdef MP-WEIXIN
this.$scope.animate(
    '.fbg6',
    [
        {
            opacity: 1
        },
        //第一个不能去掉
        {
            bottom: '910rpx',
            left: '370rpx',
            opacity: 1,
            scale: [0.5, 0.5],
            offset: 0.8
        },
        {
            bottom: '1110rpx',
            left: '210rpx',
            scale: [0.2, 0.2],
            opacity: 0.4,
            offset: 0.9
        }
    ],
    bgdur,
    function () {
        //动画结束的回调
        this.clearAnimation('.fbg6', function () {});
    }.bind(this)
);
// #endif
// #ifdef MP-WEIXIN
this.$scope.animate(
    '.fbg7',
    [
        {
            opacity: 1
        },
        //第一个不能去掉
        {
            bottom: '895rpx',
            left: '455rpx',
            opacity: 1,
            scale: [0.55, 0.55],
            offset: 0.4
        },
        {
            bottom: '1150rpx',
            left: '200rpx',
            opacity: 0.2,
            scale: [0.2, 0.2],
            offset: 0.7
        }
    ],
    bgdur,
    function () {
        //动画结束的回调
        this.clearAnimation('.fbg7', function () {});
    }.bind(this)
);
// #endif
// #ifdef MP-WEIXIN
this.$scope.animate(
    '.fbg8',
    [
        {
            opacity: 1
        },
        //第一个不能去掉
        {
            bottom: '780rpx',
            left: '425rpx',
            opacity: 1,
            scale: [0.6, 0.6],
            offset: 0.4
        },
        {
            bottom: '1100rpx',
            left: '120rpx',
            opacity: 0.2,
            scale: [0.2, 0.2],
            offset: 0.7
        }
    ],
    bgdur,
    function () {
        //动画结束的回调
        this.clearAnimation('.fbg8', function () {});
    }.bind(this)
);
// #endif
// #ifdef MP-WEIXIN
this.$scope.animate(
    '.fbg9',
    [
        {
            opacity: 1
        },
        //第一个不能去掉
        {
            bottom: '980rpx',
            left: '300rpx',
            opacity: 1,
            scale: [0.55, 0.55],
            offset: 0.5
        },
        {
            bottom: '1170rpx',
            left: '100rpx',
            opacity: 0,
            scale: [0, 0],
            offset: 0.8
        }
    ],
    bgdur,
    function () {
        //动画结束的回调
        this.clearAnimation('.fbg9', function () {});
    }.bind(this)
);
// #endif
// #ifndef MP-WEIXIN
// #ifndef MP-WEIXIN
// #ifndef MP-WEIXIN
// #ifndef MP-WEIXIN
// #ifndef MP-WEIXIN
// #ifndef MP-WEIXIN
// #ifndef MP-WEIXIN
// #ifndef MP-WEIXIN
// #ifndef MP-WEIXIN
// #ifndef MP-WEIXIN
export default {
    data() {
        return {
            topList: [],
            mountTop: 0,
            openId: '',
            animationDataTop0: '',
            animationDataTop1: '',
            animationDataTop2: '',
            show: false,

            choosed: {
                prayer_no: '',
                name: '',
                prayer_date: '',
                open: '',
                open_id: '',
                detail: ''
            },

            bgFlLst: [],
            name: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad() {
        this.autoUpdate();
        var barInfo = uni.getStorageSync('barInfo'); //获取缓存中的高度
        var windowHeight = barInfo.windowHeight;
        var windowWidth = barInfo.windowWidth;
        //原图是375 * 812 px   ==》 320 * 568
        //山是375*375 px ==> 320 * 324
        //山的高度缩小倍数为  375/ windowWidth
        //山原本上移的距离为 812 - windowHeight
        //比例换算后上移的距离为  (812-windowHeight)/(375/ windowWidth)

        //花最大的移动距离 rpx
        var len = 1200;
        var r1 = 375 / windowWidth;
        var r2 = 812 / windowHeight;
        var r = Math.min(r1, r2);
        // r=r1
        console.info('r1:' + r1);
        console.info('r2:' + r2);
        var r = r > 1 ? r : 1;
        var mountTop = windowHeight * 2 - 1624;
        mountTop = mountTop;
        console.info(mountTop);
        // 少移动了
        len = len - len / r;
        console.info(len);
        if (mountTop < 0) {
            mountTop = (mountTop + len) / r;
            if (mountTop > -250) {
                //微调
                mountTop = -250;
            }
            console.info('res:' + mountTop);
            this.setData({
                mountTop: mountTop + 'rpx'
            });
        }
        this.flowerBg();
        getsetOpenid().then((openId) => {
            this.setData({
                openId: openId
            });
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        let that = this;
        setTimeout(() => {
            that.flowerBg2();
        }, 8000);
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        getTopPrayer({}).then((data) => {
            console.info(data);
            this.setData({
                topList: data
            });
        });
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
        flowerBg: function () {
            let that = this;
            //基础库 2.9.0 开始支持，低版本需做兼容处理。
            if (compareVersion(version, '2.10.0') >= 0) {
                var fbg0 = this.animate(
                    '.fbg0',
                    [
                        {
                            opacity: 1
                        },
                        //第一个不能去掉
                        {
                            left: '250rpx',
                            bottom: '900rpx',
                            scale: [0.6, 0.6],
                            opacity: 1,
                            offset: 0.55
                        },
                        {
                            left: '260rpx',
                            bottom: '1000rpx',
                            scale: [0.5, 0.5],
                            opacity: 0.8,
                            offset: 0.7
                        },
                        {
                            bottom: '1150rpx',
                            left: '80rpx',
                            opacity: 0,
                            scale: [0.2, 0.2],
                            offset: 0.98
                        }
                    ],
                    bgdur,
                    function () {
                        //动画结束的回调
                        this.clearAnimation('.fbg0', function () {
                            that.flowerBg();
                        });
                    }.bind(this)
                );
                var fbg1 = this.animate(
                    '.fbg1',
                    [
                        {
                            opacity: 1
                        },
                        //第一个不能去掉
                        {
                            bottom: '720rpx',
                            left: '250rpx',
                            opacity: 1,
                            scale: [0.7, 0.7],
                            offset: 0.5
                        },
                        {
                            bottom: '860rpx',
                            left: '350rpx',
                            scale: [0.5, 0.5],
                            opacity: 1,
                            offset: 0.7
                        },
                        {
                            bottom: '1180rpx',
                            left: '150rpx',
                            scale: [0.2, 0.2],
                            opacity: 0,
                            offset: 0.83
                        }
                    ],
                    bgdur,
                    function () {
                        //动画结束的回调
                        this.clearAnimation('.fbg1', function () {});
                    }.bind(this)
                );
                var fbg2 = this.animate(
                    '.fbg2',
                    [
                        {
                            opacity: 1
                        },
                        //第一个不能去掉
                        {
                            bottom: '850rpx',
                            left: '390rpx',
                            opacity: 1,
                            scale: [0.55, 0.55],
                            offset: 0.5
                        },
                        {
                            bottom: '1140rpx',
                            left: '200rpx',
                            scale: [0.2, 0.2],
                            opacity: 0.2,
                            offset: 0.78
                        }
                    ],
                    bgdur,
                    function () {
                        //动画结束的回调
                        this.clearAnimation('.fbg2', function () {});
                    }.bind(this)
                );
                var fbg3 = this.animate(
                    '.fbg3',
                    [
                        {
                            opacity: 1
                        },
                        //第一个不能去掉
                        {
                            bottom: '820rpx',
                            left: '460rpx',
                            opacity: 1,
                            scale: [0.6, 0.6],
                            offset: 0.5
                        },
                        {
                            bottom: '1100rpx',
                            left: '230rpx',
                            scale: [0.2, 0.2],
                            opacity: 0.2,
                            offset: 0.78
                        }
                    ],
                    bgdur,
                    function () {
                        //动画结束的回调
                        this.clearAnimation('.fbg3', function () {});
                    }.bind(this)
                );
                var fbg4 = this.animate(
                    '.fbg4',
                    [
                        {
                            opacity: 1
                        },
                        //第一个不能去掉
                        {
                            bottom: '900rpx',
                            left: '450rpx',
                            opacity: 1,
                            scale: [0.6, 0.6],
                            offset: 0.7
                        },
                        {
                            bottom: '1150rpx',
                            left: '250rpx',
                            scale: [0.2, 0.2],
                            opacity: 0.2,
                            offset: 0.98
                        }
                    ],
                    bgdur,
                    function () {
                        //动画结束的回调
                        this.clearAnimation('.fbg4', function () {});
                    }.bind(this)
                );
            } else {
                uni.showModal({
                    title: '提示',
                    content: '当前微信版本过低，可能会影响功能体验,请升级到最新微信版本后体验完整功能。'
                });
            }
        },

        flowerBg2: function () {
            let that = this;
            var fbg5 = this.animate(
                '.fbg5',
                [
                    {
                        opacity: 1
                    },
                    //第一个不能去掉
                    {
                        bottom: '950rpx',
                        left: '425rpx',
                        opacity: 1,
                        scale: [0.6, 0.6],
                        offset: 0.8
                    },
                    {
                        bottom: '1110rpx',
                        left: '280rpx',
                        scale: [0.2, 0.2],
                        opacity: 0.2,
                        offset: 0.9
                    }
                ],
                bgdur,
                function () {
                    //动画结束的回调
                    this.clearAnimation('.fbg5', function () {
                        that.flowerBg2();
                    });
                }.bind(this)
            );
            var fbg6 = this.animate(
                '.fbg6',
                [
                    {
                        opacity: 1
                    },
                    //第一个不能去掉
                    {
                        bottom: '910rpx',
                        left: '370rpx',
                        opacity: 1,
                        scale: [0.5, 0.5],
                        offset: 0.8
                    },
                    {
                        bottom: '1110rpx',
                        left: '210rpx',
                        scale: [0.2, 0.2],
                        opacity: 0.4,
                        offset: 0.9
                    }
                ],
                bgdur,
                function () {
                    //动画结束的回调
                    this.clearAnimation('.fbg6', function () {});
                }.bind(this)
            );
            var fbg7 = this.animate(
                '.fbg7',
                [
                    {
                        opacity: 1
                    },
                    //第一个不能去掉
                    {
                        bottom: '895rpx',
                        left: '455rpx',
                        opacity: 1,
                        scale: [0.55, 0.55],
                        offset: 0.4
                    },
                    {
                        bottom: '1150rpx',
                        left: '200rpx',
                        opacity: 0.2,
                        scale: [0.2, 0.2],
                        offset: 0.7
                    }
                ],
                bgdur,
                function () {
                    //动画结束的回调
                    this.clearAnimation('.fbg7', function () {});
                }.bind(this)
            );
            var fbg8 = this.animate(
                '.fbg8',
                [
                    {
                        opacity: 1
                    },
                    //第一个不能去掉
                    {
                        bottom: '780rpx',
                        left: '425rpx',
                        opacity: 1,
                        scale: [0.6, 0.6],
                        offset: 0.4
                    },
                    {
                        bottom: '1100rpx',
                        left: '120rpx',
                        opacity: 0.2,
                        scale: [0.2, 0.2],
                        offset: 0.7
                    }
                ],
                bgdur,
                function () {
                    //动画结束的回调
                    this.clearAnimation('.fbg8', function () {});
                }.bind(this)
            );
            var fbg9 = this.animate(
                '.fbg9',
                [
                    {
                        opacity: 1
                    },
                    //第一个不能去掉
                    {
                        bottom: '980rpx',
                        left: '300rpx',
                        opacity: 1,
                        scale: [0.55, 0.55],
                        offset: 0.5
                    },
                    {
                        bottom: '1170rpx',
                        left: '100rpx',
                        opacity: 0,
                        scale: [0, 0],
                        offset: 0.8
                    }
                ],
                bgdur,
                function () {
                    //动画结束的回调
                    this.clearAnimation('.fbg9', function () {});
                }.bind(this)
            );
        },

        clickFlower(e) {
            console.log(e);
            // if(!!this.data.topList[e.currentTarget.dataset.index]){
            //   let open = this.data.topList[e.currentTarget.dataset.index].open
            //   if(open == 'N' && this.data.topList[e.currentTarget.dataset.index].open_id != this.data.openId){
            //     showErrorMsg("私密内容只有许愿者能看哦")
            //   }else{
            //     // wx.navigateTo({
            //     //   url: '/pages/prayer-info/prayer-info?prayerNo='+this.data.topList[e.currentTarget.dataset.index].prayer_no,
            //     // })

            //   }

            // }
            var prayer = this.topList[e.currentTarget.dataset.index];
            // console.info(prayer)
            if (!!prayer) {
                if (!!prayer.prayer_date) {
                    prayer.prayer_date = formatDateStr(prayer.prayer_date);
                }
                this.setData({
                    choosed: prayer,
                    show: true
                });
            }
        },

        onClose() {
            this.setData({
                show: false
            });
        },

        autoUpdate: function () {
            var that = this;
            // 获取小程序更新机制兼容
            if (uni.canIUse('getUpdateManager')) {
                const updateManager = uni.getUpdateManager();
                //1. 检查小程序是否有新版本发布
                updateManager.onCheckForUpdate(function (res) {
                    // 请求完新版本信息的回调
                    if (res.hasUpdate) {
                        //检测到新版本，需要更新，给出提示
                        uni.showModal({
                            title: '更新提示',
                            content: '检测到新版本，是否下载新版本并重启小程序？',
                            showCancel: false,
                            //隐藏取消按钮
                            confirmText: '确定更新',
                            //只保留确定更新按钮
                            success: function (res) {
                                if (res.confirm) {
                                    // 用户确定下载更新小程序，小程序下载及更新静默进行
                                    that.downLoadAndUpdate(updateManager);
                                }
                            }
                        });
                    }
                });
            } else {
                // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
                uni.showModal({
                    title: '提示',
                    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                });
            }
        },

        /**
         * 下载小程序新版本并重启应用
         */
        downLoadAndUpdate: function (updateManager) {
            uni.showLoading();
            //静默下载更新小程序新版本
            updateManager.onUpdateReady(function () {
                uni.hideLoading();
                //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
            });
            updateManager.onUpdateFailed(function () {
                // 新的版本下载失败
                uni.hideLoading();
                uni.showModal({
                    title: '已经有新版本了哟~',
                    content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                });
            });
        }
    }
};
// #endif
// #endif
// #endif
// #endif
// #endif
// #endif
// #endif
// #endif
// #endif
// #endif
</script>
<style lang="scss">
/* pages/index-js/index-js.wxss */
.bg {
    width: 750rpx;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
    z-index: -10;
    /* 通过滤镜增加毛玻璃效果 filter: blur(10rpx); */
}

.menu {
    position: fixed;
    right: 230rpx;
}

.flower-pool {
    .flower-size {
        width: 250rpx;
        height: 200rpx;
        position: absolute;
        z-index: 10;
    }

    .name {
        width: 100%;
        text-align: center;
        color: #0e0e0e;
        font-size: 30rpx;
        line-height: 30rpx;
    }

    .flower0 {
        bottom: 150rpx;
        left: 450rpx;
        z-index: 21;
    }

    .flower1 {
        bottom: 150rpx;
        left: 200rpx;
        z-index: 20;
    }

    .flower2 {
        bottom: 170rpx;
        left: 10rpx;
        scale: 0.95;
        z-index: 19;
    }

    .flower3 {
        bottom: 280rpx;
        left: 530rpx;
        scale: 0.9;
        z-index: 18;
    }

    .flower4 {
        bottom: 250rpx;
        left: 350rpx;
        scale: 0.9;
        z-index: 17;
    }

    .flower5 {
        bottom: 290rpx;
        left: 170rpx;
        scale: 0.9;
        z-index: 16;
    }

    .flower6 {
        bottom: 295rpx;
        left: -20rpx;
        scale: 0.9;
        z-index: 15;
    }

    .flower7 {
        bottom: 400rpx;
        left: 460rpx;
        scale: 0.85;
        z-index: 14;
    }

    .flower8 {
        bottom: 370rpx;
        left: 300rpx;
        scale: 0.85;
        z-index: 13;
    }

    .flower9 {
        bottom: 390rpx;
        left: 80rpx;
        scale: 0.85;
        z-index: 12;
    }
}
/*动画效果*/
.flower-move-0 {
    animation: flowermove0 4s linear infinite;
}

.flower-move-1 {
    animation: flowermove0 5s linear infinite;
}

.flower-move-2 {
    animation: flowermove0 7s linear infinite;
}

@keyframes flowermove0 {
    0% {
        transform: translateX(0rpx);
    }

    50% {
        transform: translateX(-15rpx);
    }

    100% {
        transform: translateX(0rpx);
    }
}

.flower_bg {
    width: 180rpx;
    height: 180rpx;
    position: absolute;
}
.fbg0 {
    bottom: 400rpx;
    left: -200rpx;
    opacity: 1;
}
.fbg1 {
    bottom: 460rpx;
    left: 150rpx;
    opacity: 1;
}
.fbg2 {
    bottom: 450rpx;
    left: 360rpx;
    opacity: 1;
}
.fbg3 {
    bottom: 410rpx;
    left: 480rpx;
    opacity: 1;
}
.fbg4 {
    bottom: 400rpx;
    left: 780rpx;
    opacity: 1;
}
.fbg5 {
    bottom: 460rpx;
    left: 630rpx;
    opacity: 0;
}
.fbg6 {
    bottom: 410rpx;
    left: -100rpx;
    opacity: 0;
}
.fbg7 {
    bottom: 520rpx;
    left: 410rpx;
    opacity: 0;
}
.fbg8 {
    bottom: 428rpx;
    left: 300rpx;
    opacity: 0;
}
.fbg9 {
    bottom: 450rpx;
    left: 190rpx;
    opacity: 0;
}

.popupbg {
    background: -webkit-linear-gradient(top, #c4b0f7, #c4b0f7, #fbdee3, var(--themeColor_pink));
    font-size: 28rpx;
    color: rgb(85, 83, 83);
    .no {
        margin-top: 30rpx;
    }
    .name {
        margin-top: 40rpx;
    }

    .detail {
        margin-top: 40rpx;
        font-size: 32rpx;
        color: #e11d4d;
        font-weight: bold;
        width: 500rpx;
        min-height: 200rpx;
        text-align: center;
    }
}
.need-text {
    text-align: center;
    width: 270rpx;
    height: 100rpx;
    position: absolute;
    z-index: 10;
    color: #926134;
    font-size: 30rpx;
    font-family: Arial, sans-serif;
    align-items: center;
    justify-content: center;
}
.need-bg {
    width: 350rpx;
    height: 100rpx;
    position: absolute;
    z-index: 5;
}
</style>
