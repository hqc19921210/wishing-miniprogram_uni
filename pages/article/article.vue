<template>
    <view>
        <wishing-navigation theme="blue" :showBack="true"></wishing-navigation>

        <view class="body tab-bar-body">
            <wishing-search @search="search"></wishing-search>

            <navigator class="articleContext" :url="'/pages/article-info/article-info?id=' + item.id" v-for="(item, index) in list" :key="index">
                <view class="text">
                    <view class="info">
                        <!-- <view class="index" wx:if="{{index < 3}}" style=" color: #fff; background-image: url(/images/icons/article-index.png);background-repeat:round"> -->

                        <view :class="'index ' + (index < 3 ? 'top3' : 'non-top3')">
                            <text>{{ index < 9 ? '0' : '' }}{{ index + 1 }}</text>
                        </view>
                        <view class="read">
                            <text>{{ item.read }}热度</text>
                        </view>
                    </view>
                    <view class="title">{{ item.title }}</view>
                </view>

                <view class="pic">
                    <image :lazy-load="true" :src="item.coverUrl" mode="aspectFill" class="img"></image>
                </view>
            </navigator>

            <view class="loadOut">
                <van-loading size="24px" v-if="loading">加载中...</van-loading>
                <view class="noData" v-if="noData">没有更多数据了~</view>
            </view>
        </view>

        <wishing-tab-bar :current="2" theme="blue"></wishing-tab-bar>
    </view>
</template>

<script>
import { getArticleList } from '../../api/apis.js';
import { getFullUrl } from '../../utils/util';
import { getsetOpenid } from '../../utils/api-until.js';
export default {
    data() {
        return {
            title: '',
            list: [],
            page: 1,
            size: 8,
            loading: false,
            noData: false,
            openId: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {
        this.initData();
        this.listArticle();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // if (typeof this.getTabBar === 'function' &&  this.getTabBar()) {
        //   this.getTabBar().setData({
        //     selected: 1
        //   })
        // }
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
    onPullDownRefresh() {
        //下拉重新刷新
        this.setData({
            list: [],
            loading: true,
            noData: false,
            page: 1
        });
        this.listArticle();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        //瀑布流加载
        if (!this.noData) {
            this.setData({
                //     loading: false,
                page: this.page + 1
            });
            this.listArticle();
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {},
    methods: {
        initData() {
            this.setData({
                title: '',
                list: [],
                page: 1,
                size: 8,
                loading: false,
                noData: false
            });
        },

        listArticle() {
            this.setData({
                loading: true
            });
            getsetOpenid().then((openId) => {
                this.setData({
                    openId: openId
                });
                getArticleList({
                    title: this.title,
                    page: this.page,
                    size: this.size,
                    openId: openId
                }).then(
                    (data) => {
                        uni.stopPullDownRefresh();
                        let dataList = this.list;
                        if (data[0].list.length > 0) {
                            data[0].list.forEach((i) => {
                                i.coverUrl = getFullUrl(i.coverUrl);
                            });
                            //...展开数组 然后拼接
                            dataList = [...dataList, ...data[0].list];
                        }
                        this.setData({
                            list: dataList,
                            loading: false,
                            noData: data[0].list.length == 0 || !data[0].hasNextPage
                        });
                    },
                    (error) => {
                        console.log(error);
                        this.setData({
                            loading: false
                        });
                    }
                );
            });
        },

        search(e) {
            this.setData({
                list: [],
                //  loading: false,
                noData: false,
                page: 1,
                title: e.detail
            });
            this.listArticle();
        }
    }
};
</script>
<style lang="scss">
/* pages/article/article.wxss */
.articleContext {
    display: flex;
    justify-content: space-between;
    padding: 0rpx 32rpx;

    margin-top: 42rpx;

    .text {
        width: 438rpx;
        text-align: justify;
        /*display: flex;*/
        flex-direction: column;
        justify-content: space-between;

        .title {
            font-size: 30rpx;
            font-weight: 400;
            line-height: 48rpx;
            text-align: left;
            justify-content: space-between;
        }

        .info {
            display: flex;
            height: 38rpx;
            /*justify-content: space-between;*/
            /*font-size: 28rpx;*/
            /*color: var(--descColor);*/

            /* .block{*/
            /* 	*/ /** 文字和图标居中 **/ /**/
            /* 	display: flex;*/
            /* 	align-items: center;*/

            /* }*/
            .index {
                width: 52rpx;
                height: 100%;

                font-size: 26rpx;
                /*字体居中*/
                justify-content: center;
                align-items: center;
                display: flex;
            }

            .read {
                height: 100%;
                font-size: 22rpx;
                font-weight: 400;
                color: #d1d1d1;
                margin-left: 16rpx;
                justify-content: center;
                align-items: center;
                display: flex;
            }

            .top3 {
                color: #fff;
                background-color: #4075f3;
                border-radius: 8rpx;
            }

            .non-top3 {
                color: #255fe8;
                background-color: #d4e0ff;
                border-radius: 8rpx;
            }
        }
    }

    .pic {
        width: 206rpx;
        height: 144rpx;

        .img {
            width: 100%;
            height: 100%;
            border-radius: 20rpx;
        }
    }
}
</style>
