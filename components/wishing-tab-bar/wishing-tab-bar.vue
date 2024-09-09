<template>
    <view>
        <!-- <view class="tabBar theme_{{theme}}" >  
  <view class="barItem " style="margin-left: 32rpx;">
    <view class="text">首页</view>
    <image src="/images/tab_bg.png" mode="aspectFill" class="pic"  />
  </view>
  <view class="barItem">
    <view class="text text_line2">异地许愿</view>
    <image src="/images/tab_bg.png" mode="aspectFill" class="pic"  />
  </view>
  <view class="barItem">
    <view class="text text_line2 text_bold">愿望助手</view>
    <image src="/images/tab_bg_{{theme}}.png" mode="aspectFill" class="pic"  />
  </view>
  <view class="barItem">
    <view class="text">我的</view>
    <image src="/images/tab_bg.png" mode="aspectFill" class="pic"  />
  </view>
</view> -->

        <view :class="'tabBar theme_' + theme">
            <view :class="'barItem ' + (index == 0 ? 'barItem_0' : '')" @tap="clickMenu" :data-url="item.url" :data-index="index" v-for="(item, index) in list" :key="index">
                <view :class="'text ' + (item.name.length > 2 ? 'text_line2' : '') + ' ' + (current == index ? 'text_bold' : '')">{{ item.name }}</view>

                <image :src="'/images/tab_bg_' + theme + '.png'" v-if="current == index" mode="aspectFill" class="pic" />

                <image :src="'/images/tab_bg' + unSelectType + '.png'" v-else mode="aspectFill" class="pic" />
            </view>
        </view>
        <view class="tabHidden"></view>
    </view>
</template>

<script>
// components/wishing-tab-bar/wishing-tab-bar.js
export default {
    data() {
        return {
            list: [
                {
                    name: '首页',
                    url: '/pages/index/index'
                },
                {
                    name: '异地许愿',
                    url: '/pages/prayer-form/prayer-form'
                },
                {
                    name: '愿望助手',
                    url: '/pages/assistant/assistant'
                },
                {
                    name: '我的',
                    url: '/pages/mine/mine'
                }
            ]
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
        unSelectType: {
            type: String,
            default: '1'
        },
        current: {
            type: Number,
            default: 0
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        clickMenu(e) {
            if ('/pages/prayer-form/prayer-form' == e.currentTarget.dataset.url) {
                //异地
                uni.navigateTo({
                    url: '/pages/prayer-form/prayer-form?type=Y'
                });
            } else {
                uni.switchTab({
                    url: e.currentTarget.dataset.url
                });
            }
        }
    },
    created: function () {}
};
</script>
<style lang="scss">
.tabHidden {
    /** 底部菜单栏高160rpx **/
    height: 160rpx;
    background-color: rgba(255, 255, 255, 0); /*透明*/
    width: 750rpx;
    /*opacity: 0 ;*/
}

.tabBar {
    position: fixed;
    bottom: 0rpx;
    width: 750rpx;
    height: 160rpx;

    display: flex;
    z-index: 10;

    .barItem {
        width: 172rpx;
        height: 100%;
        position: relative;
        display: block;
        font-size: 15rpx;
    }

    .barItem_0 {
        margin-left: 32rpx;
    }

    .pic {
        width: 100%;
        height: 100%;
    }

    .text {
        width: 100%;
        height: 100%;
        font-size: 30rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;

        position: absolute;
        /* text-align: center;*/
        /* line-height: 160rpx ;*/
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .text_line2 {
        width: 72rpx;
        margin-left: 50rpx;
        text-align: center;
    }

    .text_bold {
        font-weight: bold;
    }
}

/*蓝色主题*/
.theme_blue {
    background: var(--themeColor_blue);
    color: var(--themeColorText_blue);
}

.theme_gray {
    background: var(--themeColor_gray);
    color: var(--themeColorText_gray);
}

.theme_pink {
    background: var(--themeColor_pink);
    color: var(--themeColorText_pink);
}

.theme_index {
    background-color: rgba(255, 255, 255, 0); /*透明*/
    color: #753d17;
}

.theme_pool {
    background-color: rgba(255, 255, 255, 0); /*透明*/
    color: var(--themeColorText_pink);
}
</style>
