<template>
    <view>
        <wishing-navigation theme="pink" :showBack="true" :showShadow="false"></wishing-navigation>
        <van-popup :show="showLoading" @close="onClose"></van-popup>

        <view class="body tab-bar-body" @tap="closeSelect">
            <view class="prayer-bg" :style="'height: ' + height + ' ; width: 100%;'">
                <scroll-view :scroll-y="true" class="prayer-content">
                    <view class="content">
                        <view class="title text-center">
                            <view style="width: 130rpx; height: 2rpx; background: -webkit-linear-gradient(left, #ffffff, #e11d4d)"></view>
                            <view style="height: 6rpx; width: 6rpx; background-color: #e11d4d; border-radius: 50%; margin-left: 6rpx; margin-right: 26rpx"></view>
                            <view class="text">{{ prayerName }}</view>
                            <view style="height: 6rpx; width: 6rpx; background-color: #e11d4d; border-radius: 50%; margin-right: 6rpx; margin-left: 26rpx"></view>
                            <view style="width: 130rpx; height: 2rpx; background: -webkit-linear-gradient(right, #ffffff, #e11d4d)"></view>
                        </view>
                        <view class="view-center">
                            <text style="width: 420rpx; font-size: 22rpx; margin-top: 10rpx; text-align: center">{{ prayerMemo }}</text>
                        </view>
                        <view class="info">
                            <!-- <view style="height: 30rpx;"></view> -->
                            <view class="prayer-region" v-if="type == 'Y'">
                                <view style="position: relative">
                                    <view class="region-title">请选择许愿地</view>
                                </view>

                                <view class="region-select">
                                    <view class="region">
                                        <select
                                            v-if="regionList.length > 0"
                                            style="width: 100%; height: 64rpx"
                                            id="selectReion"
                                            :options="regionList"
                                            key="region"
                                            text="region"
                                            @change="changeRegion($event, { tagId: 'selectReion' })"
                                            :current="regionValue"
                                            :defaultOption="regionValue"
                                            title="地区"
                                        ></select>
                                    </view>

                                    <view class="region">
                                        <!-- <text class="current-name" wx:if="{{!addressReady}}">{{addressValue.name}}</text> -->
                                        <select
                                            v-if="addressReady"
                                            style="width: 100%; height: 64rpx"
                                            id="selectAddress"
                                            :options="templeList"
                                            :defaultOption="addressValue"
                                            @change="changeAddress($event, { tagId: 'selectAddress' })"
                                            title="许愿地"
                                        ></select>
                                    </view>
                                </view>
                                <scroll-view :scroll-y="true" class="temple-scroll">
                                    <view class="temple-list">
                                        <view class="temple" @tap="choosePic" :data-obj="item" v-for="(item, index) in templeList" :key="index">
                                            <view>
                                                <image :src="item.imgUrl" style="height: 188rpx; width: 100%; border-radius: 20rpx; border: 2rpx solid #e11d4d" mode="aspectFill" />
                                            </view>

                                            <view :class="'view-center tlemp-name ' + (item.id == choosedTemple.id ? 'sele-tlemp' : 'unsele-tlemp')">
                                                {{ item.region }}{{ item.name }}
                                            </view>

                                            <view v-if="!isIOS" :class="'view-center tlemp-name ' + (item.id == choosedTemple.id ? 'sele-tlemp' : 'unsele-tlemp') + ' under'">
                                                ￥{{ item.money }}
                                            </view>
                                        </view>
                                    </view>
                                </scroll-view>
                                <van-popup :show="popupShow" @close="onPopupClose" :lock-scroll="true" round>
                                    <view class="popupbg" style="width: 650rpx; min-height: 600rpx">
                                        <view class="view-center" style="padding: 0 40rpx; position: relative; z-index: 10">
                                            <view class="no">{{ choosedTemple.region }}{{ choosedTemple.name }}</view>
                                            <scroll-view :scroll-y="true" class="name" style="padding-bottom: 10px">
                                                <!-- style="height: 500rpx;" -->
                                                <text space="nbsp" :decode="true" style="word-break: break-all; white-space: pre-line; text-indent: 2em; max-height: 400rpx">
                                                    {{ choosedTemple.introduct }}
                                                </text>
                                            </scroll-view>
                                        </view>
                                    </view>
                                </van-popup>
                            </view>

                            <view class="prayer-form">
                                <view class="form-column form-line">
                                    <view class="text-center form-label">您的姓名：</view>
                                    <view class="form-input text-center">
                                        <input
                                            slot=""
                                            type="nickname"
                                            maxlength="16"
                                            style="width: 90%"
                                            name="input"
                                            class="name-input"
                                            placeholder="请输入昵称"
                                            :value="userName"
                                            @input="getName"
                                            @change="getNickName"
                                        />
                                        <!-- <input slot="" bind:change="getNickName" maxlength="16" type="nickname" name="input" class="name-input"  bindfocus="namefocuse" placeholder="请输入昵称" value="{{userName}}" /> -->
                                    </view>
                                </view>

                                <view class="form-column form-line">
                                    <view class="text-center form-label">愿望类型：</view>
                                    <view class="form-input text-center" @tap="showPrayerTypes">
                                        {{ prayerTypeSelected }}
                                    </view>
                                </view>

                                <view class="form-column form-line" v-if="type == 'Y'">
                                    <view class="text-center form-label">您的电话：</view>
                                    <view class="form-input text-center"><input style="width: 90%" type="number" maxlength="11" :value="userPhone" @input="getPhone" /></view>
                                </view>

                                <view class="form-column form-line" v-if="type == 'Y'">
                                    <view class="text-center form-label">您的地址：</view>
                                </view>
                                <view class="form-column form-line" v-if="type == 'Y'">
                                    <view class="form-input text-center" style="width: 100%">
                                        <input style="width: 90%" maxlength="100" type="text" :value="userAddress" @input="getAddress" />
                                    </view>
                                </view>

                                <!-- 强烈/置顶心愿才有 -->
                                <view class="form-column form-line" v-if="type == 'Q' || type == 'Z'">
                                    <view class="text-center form-label">愿望图片：</view>
                                    <van-uploader
                                        :file-list="fileList"
                                        accept="image"
                                        :use-before-read="true"
                                        @before-read="checkImgFile"
                                        @delete="deleteImg"
                                        @after-read="uploadImg"
                                        :deletable="true"
                                        max-count="1"
                                    />
                                </view>

                                <!-- 强烈/置顶心愿才有 -->
                                <view class="form-column form-line" v-if="type == 'Q' || type == 'Z'">
                                    <view class="form-label">愿望录音：</view>
                                    <view class="text-center" v-if="!!voiceUrl">
                                        <view class="prayer-audio" @tap="playOrStop">
                                            <view class="view-center"><image style="height: 30rpx; width: 30rpx" src="/static/images/icons/audio.png" mode="aspectFit" /></view>
                                            <view class="view-center">{{ voiceDuration }}s</view>
                                        </view>
                                        <view @tap="removeAudio" class="view-center" style="margin-left: 10rpx">
                                            <image style="height: 30rpx; width: 30rpx" src="/static/images/icons/remove.png" mode="aspectFit" />
                                        </view>
                                    </view>

                                    <view v-if="!voiceUrl" class="prayer-record text-center" @longpress="start" @touchend="stop">
                                        {{ audioStatus ? '录音中...' : '长按开始录音' }}
                                    </view>
                                </view>

                                <view class="form-column form-line" v-if="type == 'Z'">
                                    <view class="text-center form-label">置顶天数：</view>
                                    <view class="form-input text-center" @tap="showTopDays">
                                        {{ topDaysSelected.name }}
                                    </view>
                                </view>

                                <view class="form-column form-line" style="display: flex; justify-content: space-between">
                                    <view class="text-center form-label">您的愿望：</view>
                                    <view class="text-center form-radio" style="font-size: 20rpx; text-align: right">
                                        <van-radio-group :value="open" @change="changeOpen" direction="horizontal">
                                            <van-radio name="Y" checked-color="#E11D4D">公开</van-radio>
                                            <van-radio name="N" checked-color="#E11D4D">不公开</van-radio>
                                        </van-radio-group>
                                    </view>
                                </view>
                                <view class="form-column">
                                    <view class="form-textare text-center" style="text-align: start">
                                        <textarea name="textdata" placeholder="" @input="getDetail" :auto-height="true" v-model="detail" style="min-height: 150rpx" />
                                    </view>
                                </view>
                            </view>

                            <view class="prayer-buttom">
                                <view class="prayer-cancel text-center" @tap="cancel">返回</view>
                                <view v-if="!isIOS || type == 'P'" class="prayer-submit text-center" @tap="submit">许愿</view>
                                <view v-else class="prayer-disabled text-center">由于相关规范，IOS端异地许愿功能暂不可用</view>
                            </view>
                        </view>
                    </view>

                    <view class="memo">
                        <text>
                            注:\n 1、祈愿池为您提供许愿、祈福的平台。\n 2、许愿内容请勿填写不符合政策的过激言论，言论仅代表网友个人观点。\n 3、心诚则灵，方能有求必应。\n
                            4、愿望实现以后记得来还愿哦~
                        </text>
                    </view>

                    <view class="score">
                        <view class="view-center" style="font-size: 30rpx; font-weight: 800; color: #e11d4d">敲击乌龟可以积分哦！</view>
                        <view class="view-center" style="font-size: 24rpx; color: #f4718c; margin-top: 20rpx">积分可抵扣许愿金额，限强烈心愿/置顶心愿</view>

                        <navigator url="/pages/score/score" class="view-center" style="margin-top: 40rpx">
                            <image style="width: 400rpx; height: 250rpx" src="/static/images/turtle.png" mode="aspectFill" />
                        </navigator>

                        <view class="prayer-score-buttom">
                            <view class=""></view>
                            <navigator url="/pages/score/score" class="prayer-score text-center">去积分</navigator>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>

        <picker
            :isShowPicker="isShowTopDays"
            @sure="submitTopDays"
            @cancle="cancleTopDays"
            scrollType="normal"
            :listData="topDays"
            titleText="置顶天数"
            sureStyle="color:#09BB07"
        ></picker>
        <picker
            :isShowPicker="isShowPrayerTypes"
            @sure="submitPrayerTypes"
            @cancle="canclePrayerTypes"
            scrollType="normal"
            :listData="prayerTypes"
            titleText="愿望类型"
            sureStyle="color:#09BB07"
        ></picker>

        <wishing-tab-bar :current="type == 'Y' ? 1 : -1" theme="pink"></wishing-tab-bar>
    </view>
</template>

<script>
import select from '@/components/select/select';
import picker from '@/components/picker/picker';
import { prayerForm, savePrayerForm } from '../../api/apis.js';
import { getFullUrl, showErrorMsg, filterEmoji } from '../../utils/util';
import { getsetOpenid } from '../../utils/api-until.js';
const app = getApp();
export default {
    components: {
        select,
        picker
    },
    data() {
        return {
            //默认全屏的百分之92%高度
            height: '92vh',

            type: '',
            isIOS: '',
            audioStatus: false,
            playStatus: false,
            voiceUrl: '',
            voiceDuration: '',
            tempVoiceFilePath: '',
            showLoading: false,

            choosedTemple: {
                id: '',
                region: '',
                name: '',
                introduct: ''
            },

            popupShow: false,
            templeList: '',
            allTempleList: [],
            regionList: '',
            addressReady: false,
            templeId: 0,
            openId: '',
            prayerTypes: [],
            prayerTypeSelected: '',
            isShowPrayerTypes: false,
            topDays: [],

            topDaysSelected: {
                name: ''
            },

            isShowTopdays: false,
            fileList: [],
            userName: '',
            userPhone: '',
            userAddress: '',
            detail: '',
            open: '',
            imgUrl: '',
            prayerName: '',
            prayerMemo: '',
            regionValue: '',
            addressValue: {},
            isShowTopDays: false
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.info('onLoad');
        this.resetData();
        let type = options.type ? options.type : defaultType;
        console.info('type:' + type);
        var barInfo = uni.getStorageSync('barInfo'); //获取缓存中的高度
        var res = uni.getSystemInfoSync();
        var isIOS = res.platform == 'ios';
        this.setData({
            height: barInfo ? barInfo.fullViewHeight - barInfo.tabBarHeight + 'px' : this.height,
            //计算全屏高度
            type: type,
            isIOS: isIOS
        });
        let that = this;
        this.recorderManager = uni.getRecorderManager();
        this.recorderManager.onStart(() => {
            console.log('recorder start');
            that.setData({
                audioStatus: true,
                playStatus: false
            });
        });
        this.recorderManager.onStop((res) => {
            console.info(res);
            console.log('结束录音', res);
            that.setData({
                audioStatus: false,
                playStatus: false
            });
            if (res.duration < 2000) {
                showErrorMsg('录音时间过短');
            } else {
                const voiceFile = res.tempFilePath;
                const duration = (res.duration / 1000).toFixed(0);
                const url = getFullUrl('/api/management/attachment/upload');
                uni.uploadFile({
                    url: url,
                    filePath: voiceFile,
                    name: 'file',
                    success(res) {
                        // 上传完成需要更新 fileList
                        console.info(res);
                        console.info(res.data);
                        var obj = JSON.parse(res.data);
                        console.info(obj);
                        if (obj.success) {
                            that.setData({
                                voiceUrl: obj.data[0].url,
                                voiceDuration: duration,
                                tempVoiceFilePath: voiceFile
                            });
                        }
                    }
                });
            }
        });
        //错误回调
        this.recorderManager.onError((res) => {
            console.log(res);
            that.setData({
                audioStatus: false,
                playStatus: false
            });
        });

        //语音播放
        this.innerAudioContext = uni.createInnerAudioContext();
        this.innerAudioContext.onPlay(() => {
            console.log('开始播放');
            that.setData({
                playStatus: true,
                audioStatus: false
            });
        });
        this.innerAudioContext.onEnded(() => {
            console.log('播放完毕');
            that.setData({
                playStatus: false,
                audioStatus: false
            });
        });
        this.innerAudioContext.onStop((res) => {
            console.log('播放停止', res);
            that.setData({
                playStatus: false,
                audioStatus: false
            });
        });
        this.innerAudioContext.onError((res) => {
            console.log('播放停止异常', res);
            that.setData({
                playStatus: false,
                audioStatus: false
            });
        });
        this.innerAudioContext.onPause((res) => {
            console.log('播放暂停', res);
            that.setData({
                playStatus: false,
                audioStatus: false
            });
        });
        this.init();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow(options) {
        console.info('onShow');
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        console.info('onHide');
        this.stopPlay();
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        console.info('onUnload');
        this.stopPlay();
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
    onShareAppMessage() {},
    methods: {
        resetData() {
            this.setData({
                showLoading: false,
                //弹窗对象
                choosedTemple: {},
                popupShow: false,
                type: '',
                templeList: [],
                allTempleList: [],
                regionList: [],
                addressReady: false,
                templeId: 0,
                openId: '',
                //愿望类型（求平安等）用
                prayerTypes: [],
                prayerTypeSelected: '',
                isShowPrayerTypes: false,
                //置顶天数用
                topDays: [],
                topDaysSelected: {},
                isShowTopdays: false,
                fileList: [],
                //图片展示用
                audioStatus: false,
                //录音状态
                playStatus: false,
                //播放状态
                userName: '',
                userPhone: '',
                userAddress: '',
                detail: '',
                open: 'Y',
                imgUrl: '',
                voiceUrl: '',
                tempVoiceFilePath: '',
                //本地录音播放用
                voiceDuration: 0,
                //录音时长
                prayerName: '',
                prayerMemo: '',
                regionValue: {},
                isIOS: false
            });
        },

        //开始录音的时候
        start: function () {
            var that = this;
            const options = {
                duration: 60000,
                //指定录音的时长，单位 ms
                sampleRate: 16000,
                //采样率
                numberOfChannels: 1,
                //录音通道数
                encodeBitRate: 96000,
                //编码码率
                format: 'mp3',
                //音频格式，有效值 aac/mp3
                frameSize: 50 //指定帧大小，单位 KB
            };
            //开始录音
            uni.authorize({
                scope: 'scope.record',
                success() {
                    console.log('录音授权成功');
                    // //第一次成功授权后 状态切换为true
                    uni.vibrateShort({
                        type: 'light'
                    });
                    that.recorderManager.start(options);
                },
                fail() {
                    console.log('第一次录音授权失败');
                    uni.showModal({
                        title: '提示',
                        content: '您未授权录音，功能将无法使用',
                        showCancel: true,
                        confirmText: '授权',
                        confirmColor: '#52a2d8',
                        success: function (res) {
                            if (res.confirm) {
                                //确认则打开设置页面（重点）
                                uni.openSetting({
                                    success: (res) => {
                                        console.log(res.authSetting);
                                        if (!res.authSetting['scope.record']) {
                                            //未设置录音授权
                                            console.log('未设置录音授权');
                                            uni.showModal({
                                                title: '提示',
                                                content: '您未授权录音，功能将无法使用',
                                                showCancel: false,
                                                success: function (res) {}
                                            });
                                        } else {
                                            //第二次才成功授权
                                            console.log('设置录音授权成功');
                                            that.recorderManager.start(options);
                                        }
                                    },
                                    fail: function () {
                                        console.log('授权设置录音失败');
                                        that.setData({
                                            audioStatus: false,
                                            playStatus: false
                                        });
                                    }
                                });
                            } else if (res.cancel) {
                                console.log('cancel');
                                that.setData({
                                    audioStatus: false,
                                    playStatus: false
                                });
                            }
                        },
                        fail: function () {
                            console.log('openfail');
                            that.setData({
                                audioStatus: false,
                                playStatus: false
                            });
                        }
                    });
                }
            });
        },

        // //暂停录音
        // pause: function () {
        //   recorderManager.pause();
        //   recorderManager.onPause((res) => {

        //     console.log("暂停录音")

        //   })
        // },
        // //继续录音
        // resume: function () {
        //   recorderManager.resume();
        //   recorderManager.onStart(() => {
        //     console.log("重新开始录音")
        //   });
        //   //错误回调
        //   recorderManager.onError((res) => {
        //     console.log(res);
        //   })
        // },

        //停止录音
        stop: function () {
            this.recorderManager.stop();
        },

        //播放声音
        play: function () {
            let that = this;
            if (!!that.tempVoiceFilePath) {
                this.innerAudioContext.src = this.tempVoiceFilePath;
                this.innerAudioContext.stop();
                this.innerAudioContext.play();
            }
        },

        stopPlay() {
            if (this.playStatus) {
                this.innerAudioContext.stop();
            }
        },

        playOrStop() {
            if (this.playStatus) {
                console.info('do stop play');
                this.stopPlay();
            } else {
                console.info('do play');
                this.play();
            }
        },

        removeAudio() {
            this.setData({
                playStatus: false,
                audioStatus: false,
                voiceUrl: '',
                tempVoiceFilePath: '',
                voiceDuration: 0
            });
        },

        init() {
            const that = this;
            getsetOpenid().then((openId) => {
                this.setData({
                    openId: openId
                });
                console.info('openId:' + openId);
                prayerForm({
                    openId: openId,
                    type: that.type
                }).then((data) => {
                    if (data.length > 0) {
                        let allTempleList = data[0].templeAllList;
                        allTempleList.forEach((i) => {
                            i.imgUrl = getFullUrl(i.imgUrl);
                        });
                        let regionList = [
                            {
                                region: '全部'
                            }
                        ];
                        for (let i = 0; i < data[0].regionList.length; i++) {
                            regionList.push({
                                region: data[0].regionList[i]
                            });
                        }
                        this.setData({
                            regionList: regionList,
                            templeList: allTempleList,
                            allTempleList: allTempleList,
                            addressReady: true,
                            userName: data[0].user.name,
                            userPhone: data[0].user.phone,
                            userAddress: data[0].user.address,
                            prayerTypes: [data[0].prayerTypes],
                            prayerName: data[0].prayerInfo.name,
                            prayerMemo: data[0].prayerInfo.memo,
                            topDays: data[0].topDays,
                            regionValue: {
                                name: '全部'
                            }
                        });
                    }
                });
            });
        },

        choosePic(e) {
            var obj = e.currentTarget.dataset.obj;
            let tmpObj = Object.assign({}, obj);
            if (!!tmpObj.introduct) {
                let text = tmpObj.introduct + '';
                if (text.includes('\n')) {
                    const paragraphs = text.split('\n'); // 根据换行符分割成段落
                    let formattedText = '';
                    for (let i = 0; i < paragraphs.length; i++) {
                        const paragraph = paragraphs[i];
                        if (paragraph !== '') {
                            if (i == 0) {
                                formattedText = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + paragraph; // 添加缩进
                            } else {
                                formattedText = formattedText + '\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + paragraph;
                            }
                        }
                    }
                    text = formattedText;
                } else {
                    text = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + text;
                }
                tmpObj.introduct = text;
            }
            // console.log(obj)
            this.setData({
                addressReady: false
                //  addressValue:{},
            }); //刷新select组件
            this.setData({
                templeId: e.currentTarget.dataset.obj.id,
                regionValue: {
                    name: obj.region
                },
                addressValue: {
                    name: obj.name
                },
                addressReady: true,
                choosedTemple: tmpObj,
                popupShow: !obj.introduct ? false : true
            });
        },

        onPopupClose() {
            this.setData({
                popupShow: false
            });
        },

        changeRegion(e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            let templeList = [];
            let allTempleList = this.allTempleList;
            let selectedRegion = e.detail.name;
            if ('全部' == selectedRegion) {
                templeList = allTempleList;
            } else {
                for (let i = 0; i < allTempleList.length; i++) {
                    if (allTempleList[i].region == selectedRegion) {
                        templeList.push(allTempleList[i]);
                    }
                }
            }

            //为了刷新select组件
            this.setData({
                addressReady: false,
                addressValue: {}
            });
            this.setData({
                templeList: templeList,
                addressReady: true,
                choosedTemple: {},
                templeId: 0
            });
        },

        changeAddress(e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            console.info('changeAddress', e);
            this.setData({
                templeId: e.detail.id,
                choosedTemple: {
                    id: e.detail.id
                }
                //addressValue:{},
            });
        },

        closeSelect() {
            //  console.info("close")
            // 关闭selectselectReion
            if (this.zpSelectComponent('#selectReion')) {
                this.zpSelectComponent('#selectReion').close();
            }
            if (this.zpSelectComponent('#selectAddress')) {
                this.zpSelectComponent('#selectAddress').close();
            }
        },

        showPrayerTypes() {
            this.setData({
                isShowPrayerTypes: true
            });
        },

        submitPrayerTypes(e) {
            console.info(e);
            this.setData({
                isShowPrayerTypes: false,
                prayerTypeSelected: e.detail.choosedData[0]
            });
        },

        canclePrayerTypes() {
            this.setData({
                isShowPrayerTypes: false
            });
        },

        showTopDays() {
            this.setData({
                isShowTopDays: true
            });
        },

        submitTopDays(e) {
            this.setData({
                isShowTopDays: false,
                topDaysSelected: e.detail.choosedData[0]
            });
        },

        cancleTopDays() {
            this.setData({
                isShowTopDays: false
            });
        },

        checkImgFile(event) {
            console.info('checkImgFile');
            const { file, callback } = event.detail;
            if (file.size > 100000000) {
                //大于100M
                showErrorMsg('文件过大');
                callback(false);
            } else if (file.type != 'image') {
                showErrorMsg('请选择图片');
                callback(false);
            } else {
                callback(true);
            }
        },

        deleteImg(event) {
            this.setData({
                fileList: [],
                imgUrl: ''
            });
        },

        uploadImg(event) {
            const that = this;
            const { file } = event.detail;
            const url = getFullUrl('/api/management/attachment/upload');
            console.info(file);
            console.info(url);
            // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
            uni.uploadFile({
                url: url,
                filePath: file.url,
                name: 'file',
                // formData: { user: 'test' },
                success(res) {
                    // 上传完成需要更新 fileList
                    console.info('upload success');
                    var obj = JSON.parse(res.data);
                    if (obj.success) {
                        let imgUrl = obj.data[0].url;
                        const fileList = [];
                        fileList.push({
                            name: '图片',
                            url: getFullUrl(imgUrl)
                        });
                        that.setData({
                            fileList: fileList,
                            imgUrl: imgUrl
                        });
                    }
                }
            });
        },

        changeOpen(e) {
            this.setData({
                open: e.detail
            });
        },

        getDetail(e) {
            let filter = filterEmoji(e.detail.value); //过滤表情
            this.setData({
                detail: filter
            });
        },

        getAddress(e) {
            this.setData({
                userAddress: e.detail.value
            });
        },

        getPhone(e) {
            this.setData({
                userPhone: e.detail.value
            });
        },

        getName(e) {
            this.setData({
                userName: e.detail.value
            });
        },

        submit() {
            if (!this.openId) {
                showErrorMsg('请先授权用户信息');
                return;
            }
            if (!this.userName) {
                showErrorMsg('请输入您的姓名');
                return;
            }
            if (!this.prayerTypeSelected) {
                showErrorMsg('请选择愿望类型');
                return;
            }
            if (this.type == 'Y') {
                if (this.templeId == 0) {
                    showErrorMsg('请选择愿望地');
                    return;
                }
                if (!this.userPhone) {
                    showErrorMsg('请输入您的手机号');
                    return;
                }
                let phonePattern = /^1[0-9]{10}$/;
                if (!phonePattern.test(this.userPhone)) {
                    showErrorMsg('手机格式不正确');
                    return;
                }
                if (!this.userAddress) {
                    showErrorMsg('请输入您的地址');
                    return;
                }
                if (!this.detail) {
                    showErrorMsg('请输入您的愿望内容');
                    return;
                }
            } else if (this.type == 'Z') {
                if (!this.topDaysSelected.days) {
                    showErrorMsg('请选择您的置顶天数');
                    return;
                }
                if (!this.imgUrl && !this.voiceUrl && !this.detail) {
                    showErrorMsg('请输入您的图片/语音/愿望内容');
                    return;
                }
            } else if (this.type == 'Q') {
                if (!this.imgUrl && !this.voiceUrl && !this.detail) {
                    showErrorMsg('请输入您的图片/语音/愿望内容');
                    return;
                }
            } else if (this.type == 'P') {
                if (!this.detail) {
                    showErrorMsg('请输入您的愿望内容');
                    return;
                }
            }
            let body = {
                type: this.type,
                openId: this.openId,
                prayerType: this.prayerTypeSelected,
                topDays: this.topDaysSelected.days,
                detail: this.detail,
                open: this.open,
                imgUrl: this.imgUrl,
                voiceUrl: this.voiceUrl,
                templeId: this.templeId,
                //要反写用户表
                userName: this.userName,
                userPhone: this.userPhone,
                userAddress: this.userAddress
            };
            this.setData({
                showLoading: true
            });
            savePrayerForm(body).then(
                (data) => {
                    this.setData({
                        showLoading: false
                    });
                    let id = data[0].id;
                    let payed = data[0].payed;
                    let prayerNo = data[0].prayerNo;
                    //清楚用户本地缓存，防止反写后不一致
                    uni.removeStorage({
                        key: 'userinfo'
                    });
                    if (!!payed) {
                        uni.navigateTo({
                            url: '/pages/prayer-success/prayer-success?prayerNo=' + prayerNo
                        });
                    } else {
                        uni.navigateTo({
                            url: '/pages/prayer-pay/prayer-pay?id=' + id
                        });
                    }
                },
                (error) => {
                    console.log(error);
                    showErrorMsg(error);
                    this.setData({
                        showLoading: false
                    });
                }
            );
        },

        cancel() {
            uni.navigateTo({
                url: '/pages/prayer-choose/prayer-choose'
            });
        },

        getNickName(e) {
            this.setData({
                userName: e.detail.value
            });
        },

        onClose() {
            console.log('占位：函数 onClose 未声明');
        }
    }
};
</script>
<style lang="scss">
Page {
    background: -webkit-linear-gradient(top, #c4b0f7, #f8e4e6, #fbdee3, var(--themeColor_pink));
}

.prayer-bg {
    padding: 0rpx 40rpx;
}

.prayer-content {
    margin: 0 rpx 0rpx 4rpx 0;
    height: 100%;

    .content {
        border: 4rpx solid #ffffff;
        background: #ffffff;
        box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(255, 212, 235, 0.7) inset;
        border-radius: 40rpx;
    }

    .title {
        display: flex;
        justify-content: center;
        margin-top: 32rpx;

        .text {
            font-size: 48rpx;
            color: #e11d4d;
            font-weight: 550;
        }
    }

    .info {
        text-align: center;
        padding: 10rpx 24rpx;

        .prayer-region {
            width: 100%;
            /*height: 300rpx;*/
            border-radius: 20rpx;
            border: 2rpx solid #e11d4d;
            margin-top: 30rpx;

            .region-title {
                position: absolute;
                top: -25rpx;
                left: 172rpx;
                width: 278rpx;
                background-color: #ffffff;
                font-size: 30rpx;
                font-weight: bold;
            }

            .region-select {
                display: flex;
                justify-content: space-between;

                .region {
                    margin-top: 46rpx;
                    margin-left: 20rpx;
                    margin-right: 20rpx;
                    width: 278rpx;
                    height: 64rpx;
                    border: 2rpx solid #e11d4d;
                    border-radius: 74rpx;
                }

                .current-name {
                    /* display: block; */
                    width: 85%;
                    height: 100%;
                    word-wrap: normal;
                    overflow: hidden;
                    justify-content: center;

                    /**垂直方向居中**/
                    display: flex;
                    align-items: center;
                }
            }

            .temple-scroll {
                max-height: 794rpx;
                position: relative;
                z-index: 2;
            }

            .temple-list {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-evenly;
                margin-top: 20rpx;

                .temple {
                    width: 275rpx;
                    height: 232rpx;
                    margin-bottom: 30rpx;
                    border-radius: 20rpx;
                }
            }
        }

        .prayer-form {
            margin-top: 40rpx;

            .form-line {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
            }

            .form-column {
                margin-top: 20rpx;
                .form-label {
                    width: 132rpx;
                    font-size: 26rpx;
                    color: #313131;
                    height: 64rpx;
                }

                .form-input {
                    width: 292rpx;
                    height: 64rpx;
                    border-radius: 42rpx;
                    border: 2rpx solid #e11d4d;
                }

                .form-radio {
                    /*	margin-left: 190rpx;*/
                    height: 64rpx;
                    font-size: 20rpx;
                }

                .form-textare {
                    width: 100%;
                    min-height: 100rpx;
                    border-radius: 20rpx;
                    border: 2rpx solid #e11d4d;
                    padding: 10rpx;
                }
            }
        }

        .prayer-buttom {
            margin-top: 40rpx;

            display: flex;
            justify-content: space-between;

            .prayer-submit {
                width: 220rpx;
                height: 72rpx;
                border-radius: 46rpx;
                background-color: #e11d4d;
                color: #ffffff;
                box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(255, 212, 235, 0.7) inset;
                font-size: 28rpx;
            }
            .prayer-cancel {
                width: 220rpx;
                height: 72rpx;
                border-radius: 46rpx;
                border: 2rpx solid #e11d4d;
                color: #e11d4d;
                font-size: 28rpx;
            }
            .prayer-disabled {
                width: 320rpx;
                height: 72rpx;
                border-radius: 46rpx;
                background-color: gray;
                color: #ffffff;
                box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(248, 248, 248, 0.7) inset;
                font-size: 20rpx;
                padding: 0 20rpx;
            }
        }
    }
}

.memo {
    padding: 0rpx 0 32rpx 0;
    font-size: 20rpx;
    line-height: 18rpx;
    color: #393939;
}

.score {
    width: 100%;
    height: 450rpx;
    border: 4rpx solid #ffffff;
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(255, 212, 235, 0.7) inset;
    border-radius: 40rpx;
    padding: 40rpx 24rpx;

    .prayer-score-buttom {
        margin-top: -200rpx;

        display: flex;
        justify-content: space-between;

        .prayer-score {
            width: 140rpx;
            height: 72rpx;
            border-radius: 46rpx;
            background-color: #e11d4d;
            box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(255, 212, 235, 0.7) inset;
            color: #ffffff;
            font-size: 28rpx;
            z-index: 20;
        }
    }
}

.prayer-record {
    width: 220rpx;
    height: 72rpx;
    border-radius: 46rpx;
    background-color: #e11d4d;
    color: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(255, 212, 235, 0.7) inset;
    font-size: 28rpx;
}

.prayer-audio {
    width: 292rpx;
    height: 64rpx;
    border-radius: 42rpx;
    border: 2rpx solid #e11d4d;
    font-size: 28rpx;
    display: flex;
    padding: 0rpx 20rpx;
    justify-content: space-between;
}

.popupbg {
    background: -webkit-linear-gradient(top, #c4b0f7, #c4b0f7, #fbdee3, var(--themeColor_pink));
    font-size: 28rpx;
    color: rgb(22, 22, 22);
    .no {
        margin-top: 30rpx;
        font-size: 32rpx;
        color: #e11d4d;
        /* font-weight: bold;*/
        width: 500rpx;
        min-height: 20rpx;
        text-align: center;
    }
    .name {
        margin-top: 40rpx;
        text-align: left;
    }
}
.tlemp-name {
    font-size: 22rpx;
    height: 24rpx;
}
.unsele-tlemp {
    color: #313131;
}
.sele-tlemp {
    /*background-color:#4271f1 ;*/
    /*color: rgb(250, 250, 250);*/
    color: #d46c77;
}
.sele-tlemp.under {
    text-decoration: underline dashed white;
}
</style>
