<script>
// app.js
import { playBackgroundAudio, stopBackgroundAudio } from './utils/bg-audio.js';
export default {
    data() {
        return {};
    },
    onLaunch() {
        console.info('App laucn');

        //其他缓存高度记录高度
        uni.getSystemInfo({
            success: (e) => {
                //根据右边圆点动态计算高度，若超过默认高度，使用计算高度
                var custom = uni.getMenuButtonBoundingClientRect();
                var cBarHeight = 68; //头部栏高度 px
                var tabBarHeight = 80; //底部高度 px
                let sH = e.statusBarHeight;
                let //状态栏高度
                    // bH = t.data.custom.bottom + t.data.custom.top - sH
                    bH = custom.bottom * 2 + 10 - custom.height - sH;
                bH = bH < cBarHeight ? cBarHeight : bH;
                let barHight = bH;
                let barInfo = {
                    cBarHeight: barHight,
                    cBarTitleTop: sH,
                    cBarTitleHeight: bH,
                    cBarTitlePaddingTop: sH,
                    windowWidth: e.windowWidth,
                    windowHeight: e.windowHeight,
                    fullViewHeight: e.windowHeight - barHight,
                    tabBarHeight: tabBarHeight //底部高度 px
                };

                console.info(barInfo);
                uni.setStorageSync('barInfo', barInfo);
            }
        });
        playBackgroundAudio();
    },
    onHide() {
        stopBackgroundAudio();
    },
    globalData: {
        userInfo: null,
        //message标识
        messageTag: 'message_'
    }
};
</script>
<style>
view,
text {
    box-sizing: border-box;
}

/* 全局颜色控制 */
page {
    /* 主题色 */
    --themeColor_blue: #ddecf7;
    --themeColorText_blue: #255fe8;

    --themeColor_gray: #f5f5f5;
    --themeColorText_gray: #e11d4d;

    --themeColor_pink: #fcdfe1;
    --themeColorText_pink: #e11d4d;

    /* 定义 van-tabs 样式*/
    --tabs-bottom-bar-color: #313131;
    --tab-active-text-color: #313131;
    --font-weight-bold: 800;
}

.body {
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
}

/**  底部菜单栏高160rpx
.tab-bar-body{
  padding-bottom: 160rpx;
  background-color: rgba(255, 255, 255,0);
} 
**/

/* .title{
  text-align: center;
} */

.m-l-20 {
    margin-left: 20rpx;
}

.m-l-30 {
    margin-left: 30rpx;
}

/** van-search 的样式 **/
.van-search .van-cell__left-icon-wrap {
    color: #255fe8;
}

.van-search .van-search__content--round {
    border: 2rpx solid #255fe8;
}

.van-search .van-search__content {
    background-color: white;
}

.van-tabs__line {
    background-color: green;
}

.loadOut {
    text-align: center;
    padding: 20rpx 0;
}

.loadOut .noData {
    font-size: 24rpx;
    color: #666;
}

.text_overflow1 {
    /** 1行内容超出则显示省略号 **/
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
}

.text_overflow2 {
    /** 2行内容超出则显示省略号 **/
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

/** 文字完全居中 **/
.text-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.view-center {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

/** 文字换行 **/
.text_hh {
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
}
</style>
