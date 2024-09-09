<template>
    <view>
        <wishing-bg src="/static/images/pool_bg.png"></wishing-bg>

        <wishing-navigation theme="pool" :showBack="true" :showShadow="false"></wishing-navigation>
        <view class="body tab-bar-body pool">
            <view class="info-bar text-center">
                <!-- <view><text>成立：</text><text style="color: #FF5656 ;margin-right: 10rpx;">{{onBoardDays}}</text><text>天</text></view> -->
                <view>
                    <text>许愿：</text>
                    <text style="color: #ff5656; margin-right: 10rpx">{{ prayerCount }}</text>
                    <text>个</text>
                </view>
                <view>
                    <text>还愿：</text>
                    <text style="color: #ff5656; margin-right: 10rpx">{{ redeemCount }}</text>
                    <text>次</text>
                </view>
            </view>

            <view class="search-info">
                <view
                    class="button-bar text-center"
                    :style="'width: 140rpx;  ' + (poolType == 'prayer' ? 'background-color: #F1E9BF;color: #753D17 ;' : '')"
                    @tap="choosePoolType"
                    data-type="prayer"
                >
                    许愿池
                </view>

                <view
                    class="button-bar text-center"
                    :style="'width: 100rpx; ' + (poolType == 'image' ? 'background-color: #F1E9BF;color: #753D17 ;' : '')"
                    @tap="choosePoolType"
                    data-type="image"
                >
                    图片
                </view>
                <view class="search-bar">
                    <view>
                        <image style="height: 30rpx; width: 30rpx" src="/static/images/icons/pool_search.png" mode="aspectFit" />
                    </view>
                    <view class="search-input">
                        <input
                            placeholder-style="color: #E11D4D ;"
                            @confirm="sendDataByConfirm"
                            confirm-type="done"
                            :value="name"
                            type="text"
                            placeholder="姓名/号码"
                            style="width: 200rpx"
                        />
                    </view>
                </view>
            </view>

            <view>
                <view v-if="poolType != 'prayer'">
                    <image
                        :style="'height:40rpx;width:68rpx; margin-left: ' + (poolType == 'video' ? '200rpx' : '320rpx')"
                        src="/static/images/icons/caret-up.png"
                        mode="aspectFit"
                    />
                </view>

                <!-- 许愿池 -->
                <view v-if="poolType == 'prayer'">
                    <!-- 减20为分页 -->
                    <scroll-view :scroll-y="true" :style="'height: ' + (poolHeight - 20) + 'px; '" :scroll-into-view="viewId">
                        <view class="flower">
                            <view
                                :id="prayerList[index].prayer_no"
                                :animation="animationLst[index % 5]"
                                @tap="flowerClick"
                                :data-index="index"
                                :class="'flower-size flower' + index + ' flower-move-' + (index % 5)"
                                :style="'height: ' + flSize[index].height + ';width: ' + flSize[index].width + ';'"
                                v-for="(item, index) in 20"
                                :key="index"
                            >
                                <view v-if="!!prayerList[index]" :style="'position:absolute;' + (index <= 12 ? 'top:50rpx;' : 'top:30rpx;')" class="name">
                                    {{ prayerList[index].name }}
                                </view>

                                <image style="width: 100%; height: 100%" src="/static/images/pool_flower.png" mode="aspectFit" />
                            </view>
                        </view>
                        <view></view>
                    </scroll-view>
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
                    <view class="view-center page">
                        <view class="page-info">
                            <view class="text-center" @tap="prevPage">
                                <image class="arrow" src="/static/images/icons/pink-left.png" mode="aspectFit" />
                            </view>

                            <view
                                :id="item.index"
                                @tap="pageGoto"
                                :class="(item.show ? 'choose-item' : 'unchoose-item') + ' text-center'"
                                v-for="(item, index) in prayerPageList"
                                :key="index"
                            >
                                {{ item.index }}
                            </view>

                            <view class="text-center" @tap="nextPage">
                                <image class="arrow" src="/static/images/icons/pink-right.png" mode="aspectFit" />
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 图片池 -->
                <view v-if="poolType == 'image'" style="margin-top: -20rpx">
                    <view class="medium-pool-bg" :style="'height: ' + (poolHeight - 20) + 'px ;'">
                        <scroll-view :scroll-y="true" :show-scrollbar="false" class="medium-pool-content" @scrolltolower="loadMoreMedium">
                            <view class="medium-list">
                                <view class="medium" @tap="previewImage" :data-obj="item" v-for="(item, index) in imagePageList" :key="index">
                                    <view>
                                        <image :src="item.url" class="medium-img" mode="aspectFit" />
                                    </view>

                                    <view class="view-center medium-text">{{ item.name }}</view>

                                    <view class="view-center medium-text">{{ item.tname }}</view>
                                </view>
                            </view>
                            <view class="loadOut">
                                <van-loading size="24px" v-if="imageLoading">加载中...</van-loading>
                                <view class="noData" v-if="imageNoData && (imagePageList.length > imageSize || imagePageList.length == 0)">没有更多数据了~</view>
                            </view>
                        </scroll-view>
                    </view>
                </view>
            </view>
        </view>

        <wishing-tab-bar current="-1" theme="index" unSelectType="2" color="#FFF9D2"></wishing-tab-bar>
        <van-dialog id="van-dialog" />
    </view>
</template>

<script>
// pages/prayer-pool/prayer-pool.js
import { prayerChooseInfo, getPrayerPool, getMediumPool } from '../../api/apis.js';
import { showErrorMsg, formatDateStr, getFullUrl } from '../../utils/util.js';
import { getsetOpenid } from '../../utils/api-until.js';
export default {
    data() {
        return {
            onBoardDays: 0,
            prayerCount: 0,
            redeemCount: 0,
            poolHeight: 0,
            name: '',
            prayerList: [],
            prayerPage: 1,

            //当前页
            prayerSize: 20,

            //条数
            prayerTotalPages: 1,

            //总页数
            prayerPageList: [],

            viewId: '',
            show: false,

            choosed: {
                prayer_no: '',
                name: '',
                prayer_date: '',
                open: '',
                open_id: '',
                detail: ''
            },

            openId: '',
            animationLst: [],
            flSize: [],
            videoPage: 1,
            videoSize: 8,
            videoPageList: [],
            videoNoData: false,
            videoLoading: false,
            imagePage: 1,
            imageSize: 8,
            imagePageList: [],
            imageNoData: false,
            imageLoading: false,

            //image video prayer
            poolType: 'prayer',

            prayer_no: '',
            height: '',
            width: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {
        this.init();
        var barInfo = uni.getStorageSync('barInfo'); //获取缓存中的高度
        var contentHeight = barInfo.fullViewHeight - barInfo.tabBarHeight;
        //减去 信息栏,搜索和分页栏高度
        contentHeight = contentHeight - 30 - 40;
        this.setData({
            poolHeight: contentHeight
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
        this.iosScale();
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
        sendDataByConfirm(event) {
            this.search(event.detail.value);
        },

        search(name) {
            if (this.poolType == 'prayer') {
                this.setData({
                    name: name,
                    prayerPage: 1
                });
            } else if (this.poolType == 'image') {
                this.setData({
                    name: name,
                    imagePage: 1,
                    imagePageList: []
                });
            } else if (this.poolType == 'video') {
                this.setData({
                    name: name,
                    videoPage: 1,
                    videoPageList: []
                });
            }
            this.getPoolInfo();
        },

        init() {
            const that = this;
            getsetOpenid().then((openId) => {
                that.setData({
                    openId: openId
                });
                prayerChooseInfo({}).then(
                    (data) => {
                        if (data.length > 0) {
                            this.setData({
                                onBoardDays: data[0].onBoardDays,
                                redeemCount: data[0].redeemCount,
                                prayerCount: data[0].prayerCount
                            });
                        }
                    },
                    (error) => {
                        showErrorMsg();
                    }
                );
                this.getPoolInfo();
            });
        },

        flowerClick(e) {
            var prayer = this.prayerList[e.currentTarget.dataset.index];
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

        getPoolInfo() {
            if ('prayer' == this.poolType) {
                getPrayerPool({
                    name: this.name,
                    page: this.prayerPage,
                    size: this.prayerSize
                }).then((data) => {
                    let viewId = '';
                    if (!!data[0].list && !!data[0].list[0]) {
                        viewId = data[0].list[0].prayer_no;
                    }
                    this.setData({
                        prayerList: data[0].list,
                        prayerTotalPages: data[0].pages,
                        viewId: viewId
                    });
                    this.setPageList(data[0].pages, data[0].pageNum);
                });
            } else {
                this.setData({
                    imageLoading: true,
                    videoLoading: true
                });
                getMediumPool({
                    type: this.poolType,
                    name: this.name,
                    page: this.poolType == 'image' ? this.imagePage : this.videoPage,
                    size: this.poolType == 'image' ? this.imageSize : this.videoSize
                }).then((data) => {
                    if (this.poolType == 'image') {
                        let imageNoData = false;
                        let dataList = this.imagePageList;
                        if (data[0].list.length > 0) {
                            data[0].list.forEach((i) => {
                                i.url = getFullUrl(i.url);
                            });
                            //...展开数组 然后拼接
                            dataList = [...dataList, ...data[0].list];
                        } else {
                            imageNoData = true;
                        }
                        this.setData({
                            imagePageList: dataList,
                            imageNoData: imageNoData,
                            imageLoading: false
                        });
                    } else if (this.poolType == 'video') {
                        let videoNoData = false;
                        let dataList = this.videoPageList;
                        if (data[0].list.length > 0) {
                            data[0].list.forEach((i) => {
                                i.url = getFullUrl(i.url);
                                i.cover_url = getFullUrl(i.cover_url);
                            });
                            //...展开数组 然后拼接
                            dataList = [...dataList, ...data[0].list];
                        } else {
                            videoNoData = true;
                        }
                        this.setData({
                            videoPageList: dataList,
                            videoNoData: videoNoData,
                            videoLoading: false
                        });
                    }
                });
            }
        },

        setPageList(total, curr) {
            let pageList = [];
            let that = this;
            if (total > 5) {
                if (curr <= 3) {
                    //前3页
                    for (let i = 0; i < 5; i++) {
                        pageList.push({
                            index: i + 1,
                            show: curr == i + 1 ? true : false
                        });
                    }
                } else if (curr >= total - 2) {
                    //后3页
                    for (let i = 0; i < 5; i++) {
                        pageList.push({
                            index: total - (4 - i),
                            show: curr == total - (4 - i) ? true : false
                        });
                    }
                } else {
                    for (let i = 0; i < 5; i++) {
                        pageList.push({
                            index: curr + (i - 2),
                            show: curr == curr + (i - 2) ? true : false
                        });
                    }
                }
            } else {
                for (let i = 0; i < total; i++) {
                    pageList.push({
                        index: i + 1,
                        show: curr == i + 1 ? true : false
                    });
                }
            }
            this.setData({
                prayerPageList: pageList
            });
        },

        pageGoto(e) {
            this.setData({
                prayerPage: Number(e.currentTarget.id)
            });
            this.getPoolInfo();
        },

        prevPage() {
            if (this.prayerPage == 1) {
                return;
            }
            this.setData({
                prayerPage: this.prayerPage - 1
            });
            this.getPoolInfo();
        },

        nextPage() {
            if (this.prayerPage == this.PrayerTotalPages) {
                return;
            }
            this.setData({
                prayerPage: this.prayerPage + 1
            });
            this.getPoolInfo();
        },

        iosScale() {
            //长宽计算

            let that = this;
            for (let index = 0; index < 20; index++) {
                switch (index) {
                    case 0:
                    case 1:
                        that.myJquery('.flower' + index, 1);
                        break;
                    case 2:
                    case 3:
                        that.myJquery('.flower' + index, 0.85);
                        break;
                    case 4:
                    case 5:
                    case 6:
                        that.myJquery('.flower' + index, 0.8);
                        break;
                    case 7:
                    case 8:
                    case 9:
                        that.myJquery('.flower' + index, 0.75);
                        break;
                    case 10:
                    case 11:
                    case 12:
                        that.myJquery('.flower' + index, 0.7);
                        break;
                    case 13:
                    case 14:
                    case 15:
                    case 16:
                        that.myJquery('.flower' + index, 0.65);
                        break;
                    case 17:
                    case 18:
                    case 19:
                        that.myJquery('.flower' + index, 0.5);
                        break;
                    default:
                        break;
                }
            }
        },

        myJquery(pid, scale) {
            setTimeout(() => {
                // fixbug：不加setTimeout算出来的宽度会不准，极其坑
                uni.createSelectorQuery()
                    .in(this)
                    .select(pid)
                    .fields(
                        {
                            size: true
                        },
                        (size) => {
                            let mySizeLst = this.flSize;
                            if (mySizeLst.length == 20) {
                                return;
                            } else {
                                mySizeLst.push({
                                    height: size.height * scale + 'px',
                                    width: size.width * scale + 'px'
                                });
                            }
                            this.setData({
                                flSize: mySizeLst
                            });
                        }
                    )
                    .exec();
            }, 0);
        },

        choosePoolType(e) {
            let type = e.currentTarget.dataset.type;
            this.setData({
                poolType: type,
                imageNoData: false,
                videoNoData: false
            });
            this.search('');
        },

        previewImage: function (event) {
            uni.previewImage({
                urls: [event.currentTarget.dataset.obj.url],
                //当前图片地址
                success: function (res) {
                    console.log('预览图片成功！');
                },
                fail: function (res) {
                    console.log('预览图片失败！');
                }
            });
        },

        previewVideo: function (event) {
            //let mid = event.currentTarget.dataset.obj.mid
            //let pid = event.currentTarget.dataset.obj.pid
            // wx.navigateTo({
            //   url: '/pages/video-play/video-play?id='+mid+"&prayerId="+pid,
            // })
        },

        loadMoreMedium() {
            //瀑布流加载
            if (this.poolType == 'image') {
                if (!this.imageNoData) {
                    this.setData({
                        imagePage: this.imagePage + 1
                    });
                    this.getPoolInfo();
                }
            } else if (this.poolType == 'video') {
                if (!this.videoNoData) {
                    this.setData({
                        videoPage: this.videoPage + 1
                    });
                    this.getPoolInfo();
                }
            }
        }
    }
};
</script>
<style lang="scss">
/* pages/prayer-pool/prayer-pool.wxss */
.pool {
    position: relative;
    /*height: 1200rpx;*/
}

.info-bar {
    width: 750rpx;
    height: 60rpx;
    background-color: #ffffff;

    display: flex;
    justify-content: space-evenly;
    font-size: 26rpx;
    color: #3b4e65;
}

.search-info {
    width: 750rpx;
    height: 70rpx;
    font-size: 26rpx;
    display: flex;
    justify-content: space-evenly;
    padding: 10rpx 0;
}

.button-bar {
    height: 50rpx;
    border-radius: 74pt;
    background-color: #ffffff;
    color: #e11d4d;
}

.search-bar {
    width: 300rpx;
    height: 50rpx;
    border-radius: 74pt;
    background-color: #ffffff;
    /*	margin-top: 20rpx;*/
    display: flex;
    justify-content: flex-start;
    padding: 14rpx;

    .search-input {
        margin-left: 18rpx;
        display: flex;
        align-items: center;
    }
}

.view-center-pages {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding-bottom: 50rpx;
}

.flower {
    .flower-size {
        width: 295rpx;
        height: 240rpx;
    }

    .name {
        width: 100%;
        text-align: center;
        color: #0e0e0e;
    }

    .flower0 {
        position: absolute;
        top: 920rpx;
        left: 410rpx;
        font-size: 30rpx;
        /* scale: 1;*/
        /* transform: scale(1);*/
        /* -webkit-transform: scale(1); */
        /* -moz-transform: scale(1);*/
        /* -ms-transform: scale(1);*/
        /* -o-transform: scale(1);*/
        /* display: inline-block;*/
    }

    .flower1 {
        position: absolute;
        top: 920rpx;
        left: 60rpx;
        font-size: 30rpx;
        /* scale: 1;*/
        /* transform: scale(1);*/
        /* -webkit-transform: scale(1); */
        /* -moz-transform: scale(1);*/
        /* -ms-transform: scale(1);*/
        /* -o-transform: scale(1);*/
        /* display: inline-block;*/
    }

    .flower2 {
        position: absolute;
        top: 800rpx;
        left: 260rpx;
        font-size: 26rpx;
        /* scale: 0.85;*/
        /* transform: scale(0.85);*/
        /* -webkit-transform: scale(0.85); */
        /* -moz-transform: scale(0.85);*/
        /* -ms-transform: scale(0.85);*/
        /* -o-transform: scale(0.85);*/
        display: inline-block;
    }

    .flower3 {
        position: absolute;
        top: 730rpx;
        left: 30rpx;
        font-size: 26rpx;
        /* scale: 0.85;*/
        /* transform: scale(0.85);*/
        /* -webkit-transform: scale(0.85); */
        /* -moz-transform: scale(0.85);*/
        /* -ms-transform: scale(0.85);*/
        /* -o-transform: scale(0.85);*/
        /*display: inline-block;*/
    }

    .flower4 {
        position: absolute;
        top: 630rpx;
        left: 250rpx;
        font-size: 26rpx;
        /* scale: 0.8;*/
        /* transform: scale(0.8);*/
        /* -webkit-transform: scale(0.8); */
        /* -moz-transform: scale(0.8);*/
        /* -ms-transform: scale(0.8);*/
        /* -o-transform: scale(0.8);*/
        /*display: inline-block;*/
    }

    .flower5 {
        position: absolute;
        top: 700rpx;
        left: 480rpx;
        font-size: 26rpx;
        /* scale: 0.8;*/
        /* transform: scale(0.8);*/
        /* -webkit-transform: scale(0.8); */
        /* -moz-transform: scale(0.8);*/
        /* -ms-transform: scale(0.8);*/
        /* -o-transform: scale(0.8);*/
        /*display: inline-block;*/
    }

    .flower6 {
        position: absolute;
        top: 580rpx;
        left: 30rpx;
        font-size: 26rpx;
        /* scale: 0.8;*/
        /* transform: scale(0.8);*/
        /* -webkit-transform: scale(0.8); */
        /* -moz-transform: scale(0.8);*/
        /* -ms-transform: scale(0.8);*/
        /* -o-transform: scale(0.8);*/
        /*display: inline-block;*/
    }

    .flower7 {
        position: absolute;
        top: 480rpx;
        left: 230rpx;
        font-size: 24rpx;
        /* scale: 0.75;*/
        /* transform: scale(0.75);*/
        /* -webkit-transform: scale(0.75); */
        /* -moz-transform: scale(0.75);*/
        /* -ms-transform: scale(0.75);*/
        /* -o-transform: scale(0.75);*/
        /*display: inline-block;*/
    }

    .flower8 {
        position: absolute;
        top: 530rpx;
        left: 430rpx;
        font-size: 24rpx;
        /* scale: 0.75;*/
        /* transform: scale(0.75);*/
        /* -webkit-transform: scale(0.75); */
        /* -moz-transform: scale(0.75);*/
        /* -ms-transform: scale(0.75);*/
        /* -o-transform: scale(0.75);*/
        /*display: inline-block;*/
    }

    .flower9 {
        position: absolute;
        top: 400rpx;
        left: 60rpx;
        font-size: 24rpx;
        /* scale: 0.75;*/
        /* transform: scale(0.75);*/
        /* -webkit-transform: scale(0.75); */
        /* -moz-transform: scale(0.75);*/
        /* -ms-transform: scale(0.75);*/
        /* -o-transform: scale(0.75);*/
        /*display: inline-block;*/
    }

    .flower10 {
        position: absolute;
        top: 280rpx;
        left: 160rpx;
        font-size: 24rpx;
        /* scale: 0.7;*/
        /* transform: scale(0.7);*/
        /* -webkit-transform: scale(0.7); */
        /* -moz-transform: scale(0.7);*/
        /* -ms-transform: scale(0.7);*/
        /* -o-transform: scale(0.7);*/
        /*display: inline-block;*/
    }

    .flower11 {
        position: absolute;
        top: 350rpx;
        left: 330rpx;
        font-size: 24rpx;
        /* scale: 0.7;*/
        /* transform: scale(0.7);*/
        /* -webkit-transform: scale(0.7); */
        /* -moz-transform: scale(0.7);*/
        /* -ms-transform: scale(0.7);*/
        /* -o-transform: scale(0.7);*/
        /*display: inline-block;*/
    }

    .flower12 {
        position: absolute;
        top: 390rpx;
        left: 500rpx;
        font-size: 24rpx;
        /* scale: 0.7;*/
        /* transform: scale(0.7);*/
        /* -webkit-transform: scale(0.7); */
        /* -moz-transform: scale(0.7);*/
        /* -ms-transform: scale(0.7);*/
        /* -o-transform: scale(0.7);*/
        /*display: inline-block;*/
    }

    .flower13 {
        position: absolute;
        top: 200rpx;
        left: 30rpx;
        font-size: 22rpx;
        /* scale: 0.65;*/
        /* transform: scale(0.65);*/
        /* -webkit-transform: scale(0.65); */
        /* -moz-transform: scale(0.65);*/
        /* -ms-transform: scale(0.65);*/
        /* -o-transform: scale(0.65);*/
        /*display: inline-block;*/
    }

    .flower14 {
        position: absolute;
        top: 200rpx;
        left: 530rpx;
        font-size: 22rpx;
        /* scale: 0.65;*/
        /* transform: scale(0.65);*/
        /* -webkit-transform: scale(0.65); */
        /* -moz-transform: scale(0.65);*/
        /* -ms-transform: scale(0.65);*/
        /* -o-transform: scale(0.65);*/
        /*display: inline-block;*/
    }

    .flower15 {
        position: absolute;
        top: 170rpx;
        left: 350rpx;
        font-size: 22rpx;
        /* scale: 0.65;*/
        /* transform: scale(0.65);*/
        /* -webkit-transform: scale(0.65); */
        /* -moz-transform: scale(0.65);*/
        /* -ms-transform: scale(0.65);*/
        /* -o-transform: scale(0.65);*/
        /*display: inline-block;*/
    }

    .flower16 {
        position: absolute;
        top: 130rpx;
        left: 180rpx;
        font-size: 22rpx;
        /* scale: 0.65;*/
        /* transform: scale(0.65);*/
        /* -webkit-transform: scale(0.65); */
        /* -moz-transform: scale(0.65);*/
        /* -ms-transform: scale(0.65);*/
        /* -o-transform: scale(0.65);*/
        /*display: inline-block;*/
    }

    .flower17 {
        position: absolute;
        top: 40rpx;
        left: 70rpx;
        font-size: 22rpx;
        /* scale: 0.5;*/
        /* transform: scale(0.5);*/
        /* -webkit-transform: scale(0.5); */
        /* -moz-transform: scale(0.5);*/
        /* -ms-transform: scale(0.5);*/
        /* -o-transform: scale(0.5);*/
        /*display: inline-block;*/
    }

    .flower18 {
        position: absolute;
        top: 40rpx;
        left: 430rpx;
        font-size: 22rpx;
        /* scale: 0.5;*/
        /* transform: scale(0.5);*/
        /* -webkit-transform: scale(0.5); */
        /* -moz-transform: scale(0.5);*/
        /* -ms-transform: scale(0.5);*/
        /* -o-transform: scale(0.5);*/
        /*display: inline-block;*/
    }

    .flower19 {
        position: absolute;
        top: 0rpx;
        left: 260rpx;
        font-size: 22rpx;
        /* scale: 0.5;*/
        /* transform: scale(0.5);*/
        /* -webkit-transform: scale(0.5); */
        /* -moz-transform: scale(0.5);*/
        /* -ms-transform: scale(0.5);*/
        /* -o-transform: scale(0.5);*/
        /*display: inline-block;*/
    }
}

.page {
    width: 750rpx;
    /* height: 30px;*/
    /*position: fixed;*/
    /*bottom: 180rpx; //底部菜单*/
    /*position: absolute;*/
    /*top: 1220rpx;*/

    .page-info {
        display: flex;
        height: 40rpx;
    }

    .arrow {
        width: 36rpx;
        height: 36rpx;
        color: #fc96cd;
    }

    .choose-item {
        width: 36rpx;
        height: 36rpx;
        border: 1rpx solid #fc96cd;
        border-radius: 8rpx;
        font-size: 26rpx;
        background-color: #fc96cd;
        color: #ffffff;
        margin: 0rpx 10rpx;
    }

    .unchoose-item {
        width: 36rpx;
        height: 36rpx;
        border: 1rpx solid #fc96cd;
        border-radius: 8rpx;
        font-size: 26rpx;
        background-color: #ffffff;
        color: #fc96cd;
        margin: 0rpx 10rpx;
    }
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

/*动画效果*/
.flower-move-0 {
    animation: flowermove0 4s linear infinite;
}

@keyframes flowermove0 {
    0% {
        transform: translateX(0rpx);
    }

    50% {
        transform: translateX(-10rpx);
    }

    100% {
        transform: translateX(0rpx);
    }
}

.flower-move-1 {
    animation: flowermove1 5s linear infinite;
}

@keyframes flowermove1 {
    0% {
        transform: translateX(0rpx);
    }

    50% {
        transform: translateX(20rpx);
    }

    100% {
        transform: translateX(0rpx);
    }
}

.flower-move-2 {
    animation: flowermove2 7s linear infinite;
}

@keyframes flowermove2 {
    0% {
        transform: translateX(0rpx);
    }

    50% {
        transform: translateX(-17rpx);
    }

    100% {
        transform: translateX(0rpx);
    }
}

.flower-move-3 {
    animation: flowermove3 10s linear infinite;
}

@keyframes flowermove3 {
    0% {
        transform: translateX(0rpx);
    }

    50% {
        transform: translateX(20rpx);
    }

    100% {
        transform: translateX(0rpx);
    }
}

.flower-move-4 {
    animation: flowermove4 10s linear infinite;
}

@keyframes flowermove4 {
    0% {
        transform: translateX(0rpx);
    }

    50% {
        transform: translateX(-18rpx);
    }

    100% {
        transform: translateX(0rpx);
    }
}

/*视频池*/
.medium-pool-bg {
    padding: 0rpx 40rpx;
}
.medium-pool-content {
    margin: 0 rpx 0rpx 4rpx 0;
    height: 100%;
    border: 4rpx solid #ffffff;
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(0, 0, 0, 0.07);
    border-radius: 40rpx;

    .medium-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        margin-top: 20rpx;

        .medium {
            width: 275rpx;
            margin-bottom: 30rpx;
            border-radius: 20rpx;
        }

        .medium-img {
            height: 330rpx;
            width: 270rpx;
            border-radius: 20rpx;
            border: 2rpx solid #eee;
        }

        .medium-text {
            font-size: 22rpx;
            color: #313131;
        }
    }
}
</style>
