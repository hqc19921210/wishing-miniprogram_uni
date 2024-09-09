<template>
    <view>
        <wishing-navigation theme="blue" :showBack="true"></wishing-navigation>

        <view class="body">
            <view style="padding: 80rpx 30rpx" v-if="loading">
                <van-skeleton title row="5" />
            </view>

            <view class="detail text_hh" v-else>
                <view class="title">
                    {{ detail.title }}
                </view>
                <view class="info">
                    <view class="left">
                        <van-icon name="eye-o" style="font-size: 28rpx" />
                        <text>{{ detail.read }}</text>
                        <text>热度</text>
                    </view>
                    <view class="right">
                        <text>{{ detail.updateDate }}</text>
                    </view>
                </view>
                <view class="content">
                    <rich-text :nodes="detail.myContent"></rich-text>
                </view>
            </view>

            <view class="fixedtab collect" @tap="collectHandle" v-if="openId">
                <van-icon :name="'/images/icons/start_' + collect_status + '.png'" class="fixedtab_icon" />
                <view class="fixedtab_text">收藏</view>
            </view>

            <view class="fixedtab share">
                <van-icon name="/images/icons/share.png" class="fixedtab_icon" />
                <view class="fixedtab_text">分享</view>
                <button open-type="share" class="shareButton">1</button>
            </view>
        </view>
    </view>
</template>

<script>
import { getReleasedArticleById, collectInsert, collectDelete } from '../../api/apis.js';
import { getFullUrl } from '../../utils/util.js';
import { getsetOpenid } from '../../utils/api-until.js';
export default {
    data() {
        return {
            loading: true,
            collect_status: 'unchoose',
            id: '',
            openId: '',
            detail: {
                title: '',
                updateDate: '',
                author: '',
                read: '',
                myContent: ''
            }
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {
        console.log(options);
        this.setData({
            id: options.id
        });
        this.getArticleDetail();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},
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
     * 用户点击右上角分享
     */
    onShareAppMessage(e) {
        return {
            title: this.detail.title,
            path: 'pages/article-info/article-info?id=' + this.detail.id
        };
    },
    // 分享到朋友圈
    onShareTimeline() {
        return {
            title: this.detail.title,
            path: 'pages/article-info/article-info?id=' + this.detail.id
        };
    },
    methods: {
        getArticleDetail() {
            getsetOpenid().then((openId) => {
                this.setData({
                    openId: openId
                });
                getReleasedArticleById({
                    id: this.id,
                    openId: this.openId
                }).then((data) => {
                    console.log(data);
                    if (data.length > 0) {
                        //修复富文本图片地址
                        data[0].myContent = data[0].myContent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
                            console.info(' match :' + match);
                            if (capture.includes('data:image') > 0) {
                                return match;
                            } else {
                                return '<img  src="' + getFullUrl(capture) + '"/>';
                            }
                        });

                        //给富文本p image标签追加class replace(/正则/g全局i忽略大小写,"替换内容")
                        data[0].myContent = data[0].myContent.replace(/<p>/gi, "<p class='pstyle'>").replace(/<img /gi, "<img class='imgstyle'");
                        let collected = data[0].myCollect == 1 ? 'choose' : 'unchoose'; //判断是否收藏了
                        this.setData({
                            collect_status: collected,
                            loading: false,
                            detail: data[0]
                        });
                    }
                });
            });
        },

        collectHandle() {
            //console.info("collectHandle")
            if (this.collect_status == 'choose') {
                this.uncollect();
            } else {
                this.collect();
            }
        },

        collect() {
            collectInsert({
                mediumId: this.id,
                openId: this.openId
            }).then((data) => {
                console.log(data);
                this.setData({
                    collect_status: 'choose'
                });
            });
        },

        uncollect() {
            collectDelete({
                mediumId: this.id,
                openId: this.openId
            }).then((data) => {
                console.log(data);
                this.setData({
                    collect_status: 'unchoose'
                });
            });
        }
    }
};
</script>
<style lang="scss">
/*文字换行*/
.text_hh {
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
}

.detail {
    padding: 40rpx;

    .title {
        line-height: 30rpx;
        text-align: left;
        font-size: 30rpx;
        font-weight: bold;
        color: #313131;
    }

    .info {
        font-size: 28rpx;
        color: #999;
        display: flex;
        justify-content: space-between;
        /*padding: 34rpx 0 20rpx 0rpx;*/
        padding-top: 30rpx;
        .left {
            text {
                padding-left: 10rpx;
            }
        }

        .right {
            text {
                padding-right: 10rpx;
            }
            display: flex;
            align-items: center;

            position: relative;

            text {
                padding-left: 5rpx;
            }
        }
    }

    .content {
        /*首行缩进2字*/
        /*text-indent: 2em;*/
        padding-top: 30rpx;
        .pstyle {
            padding-bottom: 10rpx;
            line-height: 1.6em;
        }

        .imgstyle {
            border-radius: 20rpx;
            width: 100%;
        }
    }
}

.fixedtab {
    width: 96rpx;
    height: 96rpx;
    background: #ddecf7;
    position: fixed;
    opacity: 1;
    border: 4rpx solid #ffffff;
    border-radius: 50%;
    z-index: 10;
}

.collect {
    bottom: 166rpx;
    right: 12rpx;
}

.share {
    bottom: 46rpx;
    right: 12rpx;
}

.shareButton {
    bottom: 75rpx;
    left: 0rpx;
    opacity: 0;
}

.fixedtab_icon {
    font-size: 32rpx;
    color: #255fe8;
    font-weight: 200;
    margin-left: 29rpx;
    margin-top: 14rpx;
}

.fixedtab_text {
    font-size: 20rpx;
    font-weight: 500;
    color: #313131;
    text-align: center;
}
</style>
