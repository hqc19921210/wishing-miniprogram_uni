<template>
    <view>
        <wishing-navigation theme="gray" :showBack="true"></wishing-navigation>

        <view class="body tab-bar-body">
            <view class="collect-content">
                <van-tabs animated @click="changeType">
                    <van-tab title="我的收藏" name="A">
                        <view class="noData" style="margin-top: 20rpx" v-if="list.length < 1">暂时没有收藏的文章~</view>
                        <navigator class="collect-item" :url="'/pages/article-info/article-info?id=' + item.id" v-for="(item, index) in list" :key="index">
                            <view class="text">
                                <view class="title">{{ item.title }}</view>
                            </view>

                            <view class="pic">
                                <image :src="item.coverUrl" mode="aspectFill" class="img"></image>
                            </view>
                        </navigator>
                        <view class="loadOut">
                            <van-loading size="24px" v-if="Aloading">加载中...</van-loading>
                            <view class="noData" v-if="AnoData">没有更多数据了~</view>
                        </view>
                    </van-tab>

                    <van-tab title="" disabled></van-tab>
                    <van-tab title="" disabled></van-tab>
                    <van-tab title="" disabled></van-tab>
                    <van-tab title="" disabled></van-tab>
                </van-tabs>
            </view>
        </view>

        <wishing-tab-bar :current="1" theme="gray"></wishing-tab-bar>
    </view>
</template>

<script>
// pages/collect/collect.js
import { getCollectMediumList } from '../../api/apis.js';
import { getFullUrl } from '../../utils/util';
import { getsetOpenid } from '../../utils/api-until.js';
export default {
    data() {
        return {
            type: 'A',
            list: [],
            page: 1,
            size: 8,
            Aloading: false,
            AnoData: false
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {},
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.initData();
        this.listArticle();
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
    onReachBottom() {
        //下拉重新刷新
        this.setData({
            list: [],
            Aloading: true,
            AnoData: false,
            page: 1
        });
        this.listArticle();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {},
    methods: {
        initData() {
            this.setData({
                list: [],
                page: 1,
                size: 8,
                Aloading: false,
                AnoData: false
            });
        },

        listArticle() {
            let that = this;
            that.setData({
                Aloading: true
            });
            getsetOpenid().then((opid) => {
                if (!opid) {
                    showErrorMsg('未获取到用户信息');
                    setTimeout(function () {
                        uni.navigateBack();
                    }, '2000');
                    return;
                }
                getCollectMediumList({
                    type: that.type,
                    page: that.page,
                    size: that.size,
                    openId: opid
                }).then(
                    (data) => {
                        uni.stopPullDownRefresh();
                        console.log(data);
                        let dataList = this.list;
                        if (data[0].list.length > 0) {
                            data[0].list.forEach((i) => {
                                i.coverUrl = getFullUrl(i.coverUrl);
                            });
                            //...展开数组 然后拼接
                            dataList = [...dataList, ...data[0].list];
                        }
                        that.setData({
                            list: dataList,
                            Aloading: false,
                            AnoData: data[0].isLastPage && !data[0].isFirstPage //大于1页时才显示没有更多数据
                        });
                    },
                    (error) => {
                        console.log(error);
                        that.setData({
                            Aloading: false
                        });
                    }
                );
            });
        },

        changeType(e) {
            console.info('changeType', e);
            let currType = e.detail.name;
            let that = this;
            if (that.type == currType) {
                //同tag不操作
                return;
            }
            that.setData({
                type: currType,
                list: [],
                page: 1,
                size: 8,
                AnoData: false
            });
            that.listArticle();
        }
    }
};
</script>
<style lang="scss">
/* pages/collect/collect.wxss */
.collect-content {
    padding: 0 32rpx;

    .collect-item {
        display: flex;
        justify-content: space-between;
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
}

.loadOut {
    text-align: center;
    padding: 20rpx 0;
}

.noData {
    font-size: 24rpx;
    color: #666;
}
</style>
