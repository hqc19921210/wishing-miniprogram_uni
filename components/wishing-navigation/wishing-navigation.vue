<template>
    <view :class="'cu-custom ' + topClass" :style="'height:' + cBarHeight + 'px'">
        <view
            :class="'cu-bar fixed  ' + titleClass + ' bg-gradual-' + theme"
            :style="
                'height:' +
                cBarTitleHeight +
                'px;padding-top:' +
                (cBarTitlePaddingTop - 13) +
                'px;' +
                (title ? 'text-align: center;' : 'text-align: left;') +
                background +
                (!showShadow ? 'box-shadow:unset;' : '')
            "
        >
            <!-- showBack && showHome start -->
            <view
                v-if="showBack && showHome"
                class="action border-custom"
                :style="'width:' + custom.width + 'px;height:' + custom.height + 'px;margin-left:calc(750rpx - ' + custom.right + 'px)'"
            >
                <view class="citem" :open-type="navBackType" delta="1" hover-class="none" :style="'width:' + custom.width + 'px;height:' + custom.height + 'px;'">
                    <text class="cu-icon-font icon-back text" :style="'height:' + custom.height + 'px;'"></text>
                </view>
                <navigator class="citem" :open-type="hOpenType" hover-class="none" :url="hPath" :style="'width:' + custom.width + 'px;height:' + custom.height + 'px;'">
                    <text class="cu-icon-font icon-homefill text" :style="'height:' + custom.height + 'px;'"></text>
                </navigator>
            </view>
            <!-- showBack && showHome end -->
            <view v-else-if="showBack && hasPrePageClone" class="action" open-type="navigateBack" delta="1" hover-class="none">
                <text class="cu-icon-font icon-back text"></text>
                {{ showBackText }}
            </view>
            <navigator v-else-if="showBack && !hasPrePageClone" class="action" url="/pages/index/index" open-type="switchTab" hover-class="none">
                <text class="cu-icon-font icon-back text"></text>
                {{ showBackText }}
            </navigator>

            <navigator v-else-if="showHome" class="action" :open-type="hOpenType" :url="hPath" hover-class="none">
                <text class="cu-icon-font icon-homefill text home-only"></text>
            </navigator>

            <view
                :class="'content ' + titleTextClass + ' ' + (loading ? 'nva-loading' : '') + ' '"
                :style="'top:' + (cBarTitleTop - 14) + 'px;margin-left: ' + (title ? '' : showBackText ? '' : hDouble ? '110px' : '50px') + '; '"
            >
                <text v-if="loading" class="iconfont2 icon-loading"></text>
                <view v-if="title">
                    <text>{{ title }}</text>
                </view>
                <view v-else>
                    <text class="half-color">祈愿池 |</text>
                    <text>相信奇迹 坚信信念</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
// components/wishing-navigation/wishing-navigation.js
export default {
    data() {
        return {
            custom: uni.getMenuButtonBoundingClientRect(),

            //获取菜单按钮（右上角胶囊按钮）的布局位置信息
            cBarHeight: 68,

            //头部栏高度 px
            cBarTitleTop: 20,

            cBarTitleHeight: 68,
            cBarTitlePaddingTop: 20,
            canvasHeight: 300,
            canvasWidth: 300,
            fullViewHeight: 0,

            //去除头部栏后的屏幕满屏高度 px
            windowHeight: 0,

            ////屏幕满屏高度 px
            //底部高度 px
            tabBarHeight: 80,

            hPath: '',
            hOpenType: '',
            navBackType: '',
            hDouble: '',
            addMiniTop: '',
            addMiniRight: '',
            loading: false,
            hasPrePageClone: false
        };
    },
    /**
     * 组件的属性列表
     */
    props: {
        theme: {
            type: String,
            default: 'blue'
        },
        title: {
            //自定义标题，会去掉原有许愿池，切文本居中
            type: String,
            default: ''
        },
        topClass: {
            type: String,
            default: ''
        },
        titleClass: {
            type: String,
            default: ''
        },
        titleTextClass: {
            type: String,
            default: ''
        },
        showBack: {
            //显示返回箭头
            type: Boolean,
            default: false
        },
        showBackText: {
            //返回箭头加文本 e.g <返回
            type: String,
            default: ''
        },
        showHome: {
            //显示主页键
            type: Boolean,
            default: false
        },
        homePath: {
            //主页键跳转路径 e.g./pages/index/index
            type: String,
            default: ''
        },
        homeOpenType: {
            //主页键跳转非tabbar上的页面路径 e.g. /pages/other/other
            type: String,
            default: ''
        },
        background: {
            //背景图片和标题颜色 e.g. "color:#fff; background-image:url('base64')"
            type: String,
            default: ''
        },
        showShadow: {
            //nav阴影样式
            type: Boolean,
            default: true
        },
        hasPrePage: false
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         *
         */
        ready: function () {
            let that = this;
            //缓存头部高度等信息，免得每次加载新页面都要重新计算
            var barInfo = uni.getStorageSync('barInfo');
            //var barInfo= null;

            // console.info("ready")
            let ps = getCurrentPages();
            that.setData({
                hPath: that.homePath ? that.homePath : '/pages/index/index',
                hOpenType: that.homeOpenType ? that.homeOpenType : 'switchTab',
                navBackType: ps.length <= 1 ? 'switchTab' : 'navigateBack',

                // title: t.data.title || app.globalData.appName
                hDouble: that.showBack && that.showHome
            });

            if (barInfo) {
                //   console.info("use cache")
                that.setData(barInfo);
            } else {
                uni.getSystemInfo({
                    success: (e) => {
                        //根据右边圆点动态计算高度，若超过默认高度，使用计算高度
                        let sH = e.statusBarHeight;
                        let //状态栏高度
                            // bH = t.data.custom.bottom + t.data.custom.top - sH
                            bH = that.custom.bottom * 2 + 10 - that.custom.height - sH;
                        bH = bH < that.cBarHeight ? that.cBarHeight : bH;
                        ps[ps.length - 1].setData({
                            addMiniTop: that.custom.top + that.custom.height + 10,
                            addMiniRight: Math.ceil((3 * that.custom.width) / 4) - 6
                        });
                        let barHight = that.height || bH;
                        let barInfo = {
                            cBarHeight: barHight,
                            cBarTitleTop: that.titleTop || sH,
                            cBarTitleHeight: that.titleHeight || bH,
                            cBarTitlePaddingTop: that.titlePaddingTop || sH,
                            windowHeight: e.windowHeight,
                            fullViewHeight: e.windowHeight - barHight,

                            //底部高度 px
                            tabBarHeight: 80
                        };

                        console.info({
                            screenHeight: e.screenHeight,
                            screenWidth: e.screenWidth,
                            windowWidth: e.windowWidth,
                            windowHeight: e.windowHeight,
                            safeArea: e.safeArea,
                            statusBarHeight: e.statusBarHeight,
                            fullViewHeight: e.windowHeight - barHight,
                            tabBarHeight: this.tabBarHeight
                        });
                        //   console.info(e)
                        that.setData(barInfo);
                        uni.setStorageSync('barInfo', barInfo);
                    }
                });
            }
            // console.info(t)
        },

        handlePageShow: function () {
            var that = this;
            const pages = getCurrentPages(); // 获取当前页面栈
            console.log('pages', pages);
            if (pages.length > 1) {
                // 如果当前页面栈中的页面数量大于1，说明存在上一页面
                that.setData({
                    hasPrePageClone: true
                });
            } else {
                // 否则，不存在上一页面
                that.setData({
                    hasPrePageClone: false
                });
            }
            let { showNavigationBarLoading, hideNavigationBarLoading } = Object.assign({}, wx);
            uni._showNavigationBarLoading ||
                uni.__defineGetter__('showNavigationBarLoading', function () {
                    uni._showNavigationBarLoading = 1;
                    return function (o) {
                        var p = getCurrentPages().pop() || {};
                        var cb = p ? p.zpSelectComponent('#c-bar') : false;
                        if (cb && cb.setData) {
                            cb.setData({
                                loading: true
                            });
                        }
                        return showNavigationBarLoading(o);
                    };
                });
            uni._hideNavigationBarLoading ||
                uni.__defineGetter__('hideNavigationBarLoading', function () {
                    uni._hideNavigationBarLoading = 1;
                    return function (o) {
                        var p = getCurrentPages().pop() || {};
                        var cb = p ? p.zpSelectComponent('#c-bar') : false;
                        if (cb && cb.setData) {
                            cb.setData({
                                loading: false
                            });
                        }
                        return hideNavigationBarLoading(o);
                    };
                });
        },

        handlePageHide: function () {},
        handlePageResize: function () {}
    },
    mounted() {
        // 处理小程序 ready 生命周期
        this.$nextTick(() => this.ready());
    },
    created: function () {},
    watch: {
        hasPrePage: {
            handler: function (newVal, oldVal) {
                this.hasPrePageClone = newVal;
            },

            immediate: true
        }
    }
};
</script>
<style lang="scss">
@import '../../icon.css'; /* components/wishing-navigation/wishing-navigation.wxss */

@font-face {
    font-family: 'iconfont2'; /* IE9 */
    src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAK4AAsAAAAABqgAAAJsAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAqBMIFLATYCJAMICwYABCAFhG0HMRvyBRHVi1eyP0GUw7QDP9JZln3ueXbKYfbXWaTq+huZiLdQH6a8P0BTuAoSAAAAACCC7/fjt+e+81WTatRmgllTS4SuCUL+oRASQ0h0PIqF/DzGiOJOZdhpl1IogfdI4xLL2nBE55ktAWSAG4jv71oOICxubfqtfFthIhRLctXgu/yP/ATChXQlPzNgL3D01quHwAAw4nDaPO8CmQ9SLnNMHhMwsDSgvTGKrEQyT0W8XU4P+jGBViOWxO506pJKWBWIJ/n+TS2EpJSzzUJjw8EUb1DN5VWZ19H3428RRUMFdefu7d2xHzvl4VoXA4IwEPjjDaiwhCQuNabOkJDplVZum0DK6I/9rwWLOKpRyH8dKtvBECd6JrEnedTKAjIZXcfVSRdShgzXPsF9q/c1z6PbUlQwmXZdstXmyTxqRFd1/PHjQPzAjEcmqst7l2QCXxD4oqxjAycAUF/Rb4QigmNXpet6JPj0bUeB+gTDPNB8ZnfwB8UDe9KSwlzSEDd6ivVJiYJWilKDr9f3qbqB23WE5oJYRtFkGJVmU8SkLqFBm2U0araBVosOjrfp85REtmDBM4bQ7S2KTu9R6faBmNRvaDDoPxp1B7S6EpcL28wElfUZjaAH+4fsaAuuVXRcfcP4XgznpRHjhXzkKPRNV87OuCEvseX4xEEkQGBaYWLP4bIQ7EwFnTRJZB/bNjS9qXG0Kq3OaAQ92D9kR1sIhouufP6G8b0Y7mho8r6Qjzw+9E03gDirtkENj/LK8YmDSIDAtMLE5uGyEOzN8wo6adKExD62NCgMVTXba9YfKJRbgP58opmVLGR83qJS')
        format('woff2'); /* iOS 4.1- */
}

.iconfont2 {
    font-family: 'iconfont2' !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.icon-loading {
    animation: rotate 0.8s linear infinite;
}
/*loading图标*/
.icon-loading:before {
    content: '\e6d1';
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

view,
text,
scroll-view,
swiper,
button,
form,
input,
textarea,
label,
navigator,
image {
    box-sizing: border-box;
}

.cu-custom {
    display: block;
    position: relative;
}

.cu-custom .cu-bar {
    min-height: 0px;
}

.cu-custom .cu-bar {
    padding-right: 220rpx;
    box-shadow: 0rpx 0rpx 0rpx;
}

.cu-bar {
    display: flex;
    position: relative;
    align-items: center;
    min-height: 100rpx;
    justify-content: space-between;
}

.cu-bar.fixed,
.nav.fixed {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1024;
    box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.1);
}

.cu-custom .cu-bar .content {
    width: calc(100% - 330rpx);
}

.cu-bar .content {
    position: absolute;

    width: calc(100% - 340rpx);
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    height: 60rpx;
    line-height: 60rpx;
    cursor: none;
    pointer-events: none;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.nva-loading {
    display: flex;
    justify-content: center;
    align-items: center;
}

.cu-bar.ios .content {
    bottom: 7px;
    height: 30px;
    font-size: 40rpx;
    line-height: 30px;
}

.cu-bar .action {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: center;
    /* max-width: 100%; */
}

.cu-bar .action > .cu-ico {
    font-size: 40rpx;
}

.cu-bar .action > .cu-ico + .cu-ico {
    margin-left: 0.5em;
}
/* 单图标返回大小 */
.cu-bar .action {
    margin-left: 40rpx;
    font-size: 40rpx;
}
/* 单图标主页大小 */
.cu-bar .action .home-only {
    font-size: 40rpx;
}

.cu-bar .action:first-child > .cu-ico,
.cu-bar .action .citem:first-child > .cu-ico {
    margin-left: -0.3em;
    margin-right: 0.3em;
}
/* 双图标大小 */
.cu-bar .action:last-child {
    margin-right: 30rpx;
}

.cu-bar .action .citem > .cu-ico {
    font-size: 36rpx;
}

.cu-bar .action .citem > .cu-ico + .cu-ico {
    margin-left: 0.5em;
}

.cu-custom .cu-bar .border-custom .citem {
    position: relative;
    height: 30px;
}

.cu-custom .cu-bar .border-custom {
    position: relative;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 1000rpx;
    height: 30px;
}

.cu-custom .cu-bar .border-custom::after {
    content: ' ';
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: inherit;
    transform: scale(0.5);
    transform-origin: 0 0;
    pointer-events: none;
    box-sizing: border-box;
    border: 1rpx solid #fff;
    opacity: 0.5;
}

.cu-custom .cu-bar .border-custom::before {
    content: ' ';
    width: 1rpx;
    height: 110%;
    position: absolute;
    top: 22.5%;
    left: 0;
    right: 0;
    margin: auto;
    transform: scale(0.5);
    transform-origin: 0 0;
    pointer-events: none;
    box-sizing: border-box;
    opacity: 0.6;
    background-color: #fff;
}

.cu-custom .cu-bar .border-custom .text {
    display: block;
    flex: 1;
    margin: auto !important;
    text-align: center;
    font-size: 34rpx;
}

.cu-custom .cu-bar .border-custom .citem .text {
    display: flex;
    flex: 1;
    margin: auto !important;
    text-align: center;
    font-size: 34rpx;
    justify-content: center;
    align-items: center;
}

.bg-gradual-blue {
    background-color: var(--themeColor_blue);
    /* background-image: url('base64'); */
    background-repeat: no-repeat;
    /* color: #fff; */
}
/* 标题字体大小 */
.bg-gradual-blue .content {
    font-size: 30rpx;
}
.bg-gradual-blue .content .half-color {
    color: var(--themeColorText_blue);
}

.bg-gradual-gray {
    background-color: var(--themeColor_gray);
    /* background-image: url('base64'); */
    background-repeat: no-repeat;
    /* color: #fff; */
}
/* 标题字体大小 */
.bg-gradual-gray .content {
    font-size: 30rpx;
}
.bg-gradual-gray .content .half-color {
    color: var(--themeColorText_gray);
}

.bg-gradual-pink {
    background-image: url(data:image/jpeg;base64,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);
    background-repeat: no-repeat;
    /* color: #fff; */
}
/* 标题字体大小 */
.bg-gradual-pink .content {
    font-size: 30rpx;
}
.bg-gradual-pink .content .half-color {
    color: var(--themeColorText_pink);
}

.bg-gradual-pool {
    background-color: rgba(255, 255, 255, 0); /*透明*/
    /* background-image: url('base64'); */
    background-repeat: no-repeat;
    /* color: #fff; */
}
/* 标题字体大小 */
.bg-gradual-pool .content {
    font-size: 30rpx;
}
.bg-gradual-pool .content .half-color {
    color: var(--themeColorText_pink);
}
</style>
