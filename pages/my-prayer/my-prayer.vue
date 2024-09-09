<template>
    <view>
        <van-popup :show="showLoading"></van-popup>
        <wishing-navigation theme="gray"></wishing-navigation>
        <view class="info">
            <view class="form-column form-line">
                <view class="text-center form-label">愿望编号：</view>
                <view class="form-input text-center form-input-arrow" @tap="showPrayerNo">
                    <text style="width: 400rpx; overflow: hidden">{{ prayerInfo.prayerNo }}</text>
                    <van-icon class="" name="arrow" />
                </view>
                <picker
                    :isShowPicker="isShowPrayerNo"
                    @sure="surePrayerNo"
                    @cancle="canclePrayerNo"
                    scrollType="normal"
                    :listData="prayerList"
                    sureStyle="color:#09BB07"
                    keyWordsOfShow="prayerNo"
                    titleText="愿望编号"
                ></picker>
            </view>

            <view class="form-column form-line">
                <view class="text-center form-label">愿望内容：</view>
                <view class="form-textare text-center" @tap="viewPrayer">
                    <text>{{ prayerInfo.detail }}</text>
                </view>
            </view>

            <!-- <view class="form-column form-line">
		<view class="text-center form-label">愿望图片：</view>
		<view class="form-image text-center ">
			<image style="width: 100%;height: 100%;" src="/images/temple.png" mode="aspectFill" />
		</view>
	</view>

	<view class="form-column form-line">
		<view class="text-center form-label">愿望录音：</view>
		<view class="form-audio ">
			<image style="width: 100%; height: 100%;" src="/images/temple.png" mode="aspectFill" />
			<audio  name="愿望语音" author="" src="/images/music.m4a" id="myAudio" controls="{{false}}"></audio>
		</view>
	
	</view> -->

            <view class="form-column form-line">
                <view class="text-center form-label">愿望记事本：</view>
                <view class="form-memo">
                    <view class="memo" v-for="(item, index) in prayerInfo.memoList" :key="index">
                        <view class="memo-data">
                            <view>日期：</view>
                            <view style="color: #000000">{{ item.updateDate }}</view>
                        </view>

                        <view class="memo-data">
                            <view>记录：</view>
                            <view class="text_hh" style="color: #000000; width: 280rpx">{{ item.memo }}</view>
                        </view>
                    </view>

                    <!-- 编写 -->
                    <view class="memo" v-if="!showAddBtn">
                        <!-- <view class="memo-data">
					<view >日期：</view>
					<view style="color: #000000;">2023-11-22 10:99:22</view>
				</view> -->
                        <view class="memo-data">
                            <view style="color: #000000; width: 100%">
                                <textarea @input="inputMsg" placeholder="请输入记事内容" :auto-height="false" style="min-height: 100%; width: 100%" />
                            </view>
                        </view>
                    </view>

                    <view class="prayer-info-buttom" v-if="openId && prayerId">
                        <view class="prayer-info text-center" v-if="showAddBtn" @tap="showAdd">添加</view>
                        <view v-if="!showAddBtn" @tap="saveMemo" class="prayer-info text-center">保存</view>
                    </view>
                </view>
            </view>
        </view>

        <wishing-tab-bar :current="3" theme="gray"></wishing-tab-bar>
    </view>
</template>

<script>
import picker from '@/components/picker/picker';
import { getMyPrayerList, saveMemo } from '../../api/apis.js';
import { getFullUrl } from '../../utils/util';
import { getsetOpenid } from '../../utils/api-until.js';
export default {
    components: {
        picker
    },
    data() {
        return {
            isShowPrayerNo: false,
            prayerIndex: 0,
            prayerList: [],
            prayerInfo: {
                prayerNo: '',
                detail: '',
                memoList: []
            },
            openId: '',
            memoMsg: '',
            prayerId: '',
            showAddBtn: true,
            showLoading: false
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {},
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
    onShareAppMessage() {},
    methods: {
        viewPrayer() {
            if (!this.prayerInfo) {
                return;
            }
            uni.navigateTo({
                url: '/pages/prayer-info/prayer-info?prayerNo=' + this.prayerInfo.prayerNo
            });
        },

        showPrayerNo: function () {
            this.setData({
                isShowPrayerNo: true
            });
        },

        surePrayerNo(e) {
            console.info(e);
            this.setData({
                prayerInfo: e.detail.choosedData[0],
                prayerIndex: e.detail.choosedIndexArr[0],
                isShowPrayerNo: false
            });
        },

        canclePrayerNo() {
            this.setData({
                isShowPrayerNo: false
            });
        },

        inputMsg(e) {
            this.setData({
                memoMsg: e.detail.value
            });
        },

        showAdd() {
            this.setData({
                showAddBtn: false
            });
        },

        init() {
            let that = this;
            getsetOpenid().then((openId) => {
                this.setData({
                    openId: openId
                });
                getMyPrayerList({
                    openId: openId
                }).then((data) => {
                    if (data.length > 0 && data[0].prayerList) {
                        //prayerList为二维数组
                        let prayerInfo = data[0].prayerList[0][0];
                        that.setData({
                            prayerInfo: prayerInfo,
                            prayerList: data[0].prayerList,
                            prayerId: prayerInfo.id
                        });
                    }
                });
            });
        },

        saveMemo() {
            let that = this;
            that.setData({
                showLoading: true
            });
            if (!!this.prayerId && !!this.openId && !!this.memoMsg) {
                saveMemo({
                    openId: this.openId,
                    prayerId: this.prayerId,
                    memo: this.memoMsg
                }).then((data) => {
                    that.setData({
                        showLoading: false
                    });
                    console.info(data);
                    let memo = data[0];
                    //手动拼memo
                    that.prayerInfo.memoList.push(memo);
                    that.prayerList[0][that.prayerIndex] = that.prayerInfo;
                    that.setData({
                        memoMsg: '',
                        showAddBtn: true,
                        prayerInfo: that.prayerInfo,
                        prayerList: that.prayerList
                    });
                });
            }
        }
    }
};
</script>
<style lang="scss">
/* pages/mine-info/mine-info.wxss */
Page {
    background-color: var(--themeColor_gray);
}

.info {
    .form-line {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: 0rpx 40rpx;
    }

    .form-column {
        margin-top: 20rpx;
        .form-label {
            width: 200rpx;
            font-size: 32rpx;
            color: #313131;
            height: 80rpx;
            font-weight: 700;
        }

        .form-input {
            width: 460rpx;
            height: 80rpx;
            border-radius: 20rpx;
            background-color: #ffffff;
            font-size: 26rpx;
        }

        .form-input-arrow {
            display: fixed;
            justify-content: center;
        }

        .form-textare {
            width: 460rpx;
            min-height: 320rpx;
            border-radius: 20rpx;
            background-color: #ffffff;
            font-size: 26rpx;
            overflow: hidden;
            padding: 15rpx 15rpx;
        }

        .form-image {
            width: 460rpx;
            height: 320rpx;
            border-radius: 20rpx;
            background-color: #ffffff;
            overflow: hidden;
        }

        .form-audio {
            width: 120rpx;
            height: 120rpx;
            border-radius: 20rpx;
            background-color: #ffffff;
            overflow: hidden;
        }

        .form-memo {
            width: 460rpx;
            min-height: 320rpx;
            padding: 10rpx;

            .memo {
                border-radius: 20rpx;
                background-color: #ffffff;
                overflow: hidden;
                min-height: 200rpx;
                width: 100%;
                margin-bottom: 20rpx;
                padding: 20rpx;

                .memo-data {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    font-size: 28rpx;
                    color: gray;
                }
            }

            .prayer-info-buttom {
                margin-top: 30rpx;

                display: flex;
                justify-content: flex-end;

                .prayer-info {
                    width: 160rpx;
                    height: 72rpx;
                    border-radius: 46rpx;
                    color: gray;
                    border: 2rpx solid gray;
                }
            }
        }
    }
}

.text_hh {
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
}
</style>
