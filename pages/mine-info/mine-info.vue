<template>
    <view>
        <!-- pages/mine-info/mine-info.wxml -->
        <wishing-navigation theme="gray" :showBack="true"></wishing-navigation>
        <view>
            <view style="position: relative">
                <van-cell-group inset class="cell-other">
                    <van-cell title="头像" is-link>
                        <view slot="">
                            <image
                                @error="imgError"
                                :src="!userFrom.showAvatarUri ? '/images/icons/defult-avatar.png' : userFrom.showAvatarUri"
                                style="width: 60rpx; height: 60rpx; border-radius: 8rpx"
                                mode="aspectFill"
                            />
                        </view>
                    </van-cell>
                </van-cell-group>
                <view class="view-center">
                    <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar" @tap="onChooseAvatar">1</button>
                </view>
            </view>

            <van-cell-group inset class="cell-other">
                <form @submit.stop.prevent="nameSubmit">
                    <van-cell id="nameclick" title="昵称">
                        <input
                            slot=""
                            @change="getNickName"
                            maxlength="16"
                            type="nickname"
                            name="input"
                            class="name-input"
                            placeholder="请输入昵称"
                            :value="!userFrom.name ? '' : userFrom.name"
                        />
                    </van-cell>
                </form>
            </van-cell-group>
            <van-cell-group inset class="cell-other">
                <picker @change="genderChange" :value="userFrom.gender" :range="genderArray">
                    <van-cell title="性别" is-link :value="!userFrom.gender ? '未知' : userFrom.gender == 1 ? '男' : userFrom.gender == 2 ? '女' : '未知'" />
                </picker>
            </van-cell-group>
            <van-cell-group inset class="cell-other">
                <picker mode="date" :value="userFrom.birthday" @change="birthdayChange">
                    <van-cell title="生日" is-link :value="!userFrom.birthday ? '未填写' : userFrom.birthday" />
                </picker>
            </van-cell-group>
            <van-cell-group inset class="cell-other">
                <van-cell id="phoneclick" title="手机" @click="myClick($event, { tagId: 'phoneclick' })" is-link :value="!userFrom.phone ? '未填写' : userFrom.phone" />
            </van-cell-group>
            <van-cell-group inset class="cell-other">
                <van-cell id="addressclick" title="地址" @click="myClick($event, { tagId: 'addressclick' })" is-link :value="!userFrom.address ? '未填写' : userFrom.address" />
            </van-cell-group>

            <van-cell-group inset class="cell-other">
                <van-cell id="emailclick" title="邮箱" @click="myClick($event, { tagId: 'emailclick' })" is-link :value="!userFrom.email ? '未填写' : userFrom.email" />
            </van-cell-group>

            <van-dialog
                id="agree-dialog"
                use-slot
                title="用户使用须知"
                :show="showGuidanceDiag"
                cancelButtonText="暂不使用"
                confirmButtonText="同意"
                show-cancel-button
                @confirm="readGuidance($event, { tagId: 'agree-dialog' })"
                @cancel="readGuidance($event, { tagId: 'agree-dialog' })"
            >
                <view style="margin: 30rpx 0; padding: 0 20rpx; font-size: 28rpx">
                    <text>使用前请您仔细阅读</text>
                    <text @tap="openGuidance" style="color: rgb(58, 144, 224)">《祈愿池小程序用户服务与隐私政策》</text>
                </view>
            </van-dialog>

            <!-- <view class="text-center" style="margin-top: 50rpx;">
		<text bindtap="openGuidance" style="color: rgb(58, 144, 224); font-size: 25rpx;">《祈愿池小程序用户服务与隐私政策》</text>
	</view> -->

            <van-popup z-index="9000" :show="showGuidance" position="bottom" @close="closeGuidance" :lock-scroll="true" round>
                <view class="popupbg" style="max-height: 1000rpx">
                    <view style="padding: 10rpx 30rpx" class="text_hh">
                        <view class="view-center" style="font-size: 30rpx; font-weight: 600; margin-top: 15rpx; margin-bottom: 30rpx">《祈愿池小程序用户服务与隐私政策》</view>

                        <view>本指引是祈愿池 记录你的心愿小程序开发者 "广西原始森林数字科技有限公司"（以下简称“开发者”）为处理你的个人信息而制定。</view>

                        <view style="margin-top: 20rpx">1.开发者处理的信息</view>
                        <text class="text_hh">
                            根据法律规定，开发者仅处理实现小程序功能所必要的信息。 为了许愿语音输入，开发者将在获取你的明示同意后，访问你的麦克风。
                            为了愿望记录，开发者将在获取你的明示同意后，收集你的微信昵称、头像。 开发者 收集你选中的照片或视频信息，用于上传用户许愿时所选择的照片。 开发者
                            收集你选中的文件，用于上传用户许愿时所选择的照片或录音。
                        </text>

                        <view style="margin-top: 20rpx">2.你的权益</view>
                        <text class="text_hh">
                            2.1关于访问你的麦克风，你可以通过以下路径：小程序主页右上角“…”—“设置”—点击特定信息—点击“不允许”，撤回对开发者的授权。
                            2.2关于收集你选中的照片或视频信息、收集你选中的文件，你可以通过以下路径：小程序主页右上角“...” — “设置” — “小程序已获取的信息” — 点击特定信息 —
                            点击“通知开发者删除”，开发者承诺收到通知后将删除信息。 2.3关于你的个人信息，你可以通过以下方式与开发者联系，行使查阅、复制、更正、删除等法定权利。
                        </text>

                        <view style="margin-top: 20rpx">3.开发者对信息的存储</view>
                        <text class="text_hh">3.1开发者承诺，除法律法规另有规定外，开发者对你的信息的保存期限应当为实现处理目的所必要的最短时间。</text>

                        <view style="margin-top: 20rpx">4信息的使用规则</view>
                        <text class="text_hh">
                            4.1开发者将会在本指引所明示的用途内使用收集的信息
                            4.2如开发者使用你的信息超出本指引目的或合理范围，开发者必须在变更使用目的或范围前，再次以手机和小程序提示方式告知并征得你的明示同意。
                        </text>

                        <view style="margin-top: 20rpx">5.信息对外提供</view>
                        <text class="text_hh">
                            5.1开发者承诺，不会主动共享或转让你的信息至任何第三方，如存在确需共享或转让时，开发者应当直接征得或确认第三方征得你的单独同意。
                            5.2开发者承诺，不会对外公开披露你的信息，如必须公开披露时，开发者应当向你告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得你的单独同意。
                        </text>

                        <view style="margin-top: 20rpx"></view>
                    </view>
                </view>
            </van-popup>

            <van-dialog
                :id="dialogCurrId"
                use-slot
                :title="'修改' + dialogCurrTitle"
                :show="dialogShow"
                show-cancel-button
                @confirm="myConfirm($event, { tagId: dialogCurrId })"
                @close="onClose($event, { tagId: dialogCurrId })"
            >
                <view>
                    <van-cell-group>
                        <van-field
                            :clearable="true"
                            :maxlength="dialogInputLength"
                            :label="dialogCurrTitle + '：'"
                            :value="dialogCurrValue"
                            :placeholder="'请输入' + dialogCurrTitle"
                            @change="onChange"
                        />
                    </van-cell-group>
                </view>
            </van-dialog>
        </view>

        <wishing-tab-bar :current="3" theme="gray"></wishing-tab-bar>
    </view>
</template>

<script>
// pages/mine-info/mine-info.js
import { getUserInfoById, updateUserInfoById } from '../../api/apis.js';
import { canUseGetUserInfo, getsetOpenid } from '../../utils/api-until.js';
import { showErrorMsg, getFullUrl, filterEmoji } from '../../utils/util.js';
export default {
    data() {
        return {
            genderArray: ['未知', '男', '女'],
            userFrom: {
                name: '',
                gender: '',
                birthday: '',
                phone: '',
                address: '',
                email: '',
                score: 0,
                avatarUri: '',
                showAvatarUri: ''
            },
            canInfo: true,
            dialogShow: false,
            dialogCurrId: '',
            dialogCurrTitle: '',
            dialogCurrValue: '',
            dialogInputLength: -1,
            iuputTmp: '',
            showGuidance: false,
            showGuidanceDiag: false
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {
        this.showGuidanceDiagFun();
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
    onUnload() {
        updateUserInfoById(this.userFrom);
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
        getUserInit() {
            let that = this;
            getsetOpenid().then((opid) => {
                if (!opid) {
                    showErrorMsg('未获取到用户信息');
                    setTimeout(function () {
                        uni.navigateBack();
                    }, '2000');
                    return;
                }
                //请求storage
                var myinfo = uni.getStorageSync('userinfo');
                console.log(myinfo);
                if (!myinfo) {
                    that.requestUserInfo(opid);
                } else {
                    that.setData({
                        userFrom: myinfo
                    });
                }
            });
        },

        requestUserInfo(opid) {
            let that = this;
            console.log('requestUserInfo');
            //请求后台
            getUserInfoById({
                openId: opid
            }).then((data) => {
                if (data.length > 0) {
                    let res = data[0];
                    res.showAvatarUri = getFullUrl(res.avatarUri);
                    that.setData({
                        userFrom: res
                    });
                    uni.setStorage({
                        key: 'userinfo',
                        data: res
                    });
                }
            });
        },

        imgError(e) {
            //资源加载失败路径修改为默认头像，根据场景决定是否启用
            console.log(e);
            // var temp = this.data.userFrom
            // temp.avatarUri = "/images/icons/defult-avatar.png"
            // this.setData({userFrom:temp})
            // wx.setStorage({
            //     key:"userinfo",
            //     data:temp
            // })
        },

        //微信获取昵称
        getNickName(e) {
            console.info('getNickName', e);
            var temp = this.userFrom;
            temp.name = filterEmoji(e.detail.value); //过滤表情
            this.setData({
                userFrom: temp
            });
            uni.setStorage({
                key: 'userinfo',
                data: temp
            });
        },

        //用户输入昵称
        nameSubmit(e) {
            var temp = this.userFrom;
            temp.name = filterEmoji(e.detail.value.input);
            this.setData({
                userFrom: temp
            });
            uni.setStorage({
                key: 'userinfo',
                data: temp
            });
        },

        onChooseAvatar(e) {
            if ('tap' === e.type && !canUseGetUserInfo()) {
                //低于21.4的点击拉起上传
                this.avatarChg();
            }
            if ('chooseavatar' === e.type) {
                const that = this;
                const { avatarUrl } = e.detail;
                uni.saveFile({
                    tempFilePath: avatarUrl,
                    success(res) {
                        that.avatarUpload(res.savedFilePath);
                    },
                    fail(event) {
                        console.log('event:' + event);
                    }
                });
            }
        },

        avatarChg() {
            const that = this;
            uni.chooseMedia({
                count: 1,
                //1张图片
                mediaType: ['image'],
                sourceType: ['album', 'camera'],
                sizeType: 'compressed',
                //压缩图片
                camera: 'front',
                success(res) {
                    console.log(res.tempFiles.tempFilePath);
                    that.avatarUpload(res.tempFiles.tempFilePath);
                },
                fail(event) {
                    console.log('event:' + event);
                }
            });
        },

        avatarUpload(path) {
            const that = this;
            const url = getFullUrl('/api/management/attachment/upload');
            console.log('保存的头像文件路径：' + path);
            uni.uploadFile({
                url: url,
                filePath: path,
                name: 'file',
                success(res) {
                    // 上传完成需要更新 fileList
                    var obj = JSON.parse(res.data);
                    console.info(obj);
                    if (obj.success) {
                        var temp = that.userFrom;
                        temp.showAvatarUri = getFullUrl(obj.data[0].url);
                        temp.avatarUri = obj.data[0].url;
                        that.setData({
                            userFrom: temp
                        });
                        uni.setStorage({
                            key: 'userinfo',
                            data: temp
                        });
                    }
                }
            });
        },

        myClick(event, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(event, _dataset);
            /* ---处理dataset end--- */
            let that = this;
            let cellType = event.currentTarget.id;
            let titleTmp = '';
            let valueTmp = '';
            let lengthTmp = 50;
            switch (cellType) {
                case 'nameclick':
                    titleTmp = '昵称';
                    valueTmp = that.userFrom.name;
                    lengthTmp = 16;
                    break;
                case 'addressclick':
                    titleTmp = '地址';
                    valueTmp = that.userFrom.address;
                    break;
                case 'emailclick':
                    titleTmp = '邮箱';
                    valueTmp = that.userFrom.email;
                    break;
                case 'phoneclick':
                    titleTmp = '电话';
                    valueTmp = that.userFrom.phone;
                    lengthTmp = 11;
                    break;
                default:
                    break;
            }
            this.setData({
                dialogShow: true,
                dialogCurrId: cellType + 'chg',
                dialogCurrTitle: titleTmp,
                dialogCurrValue: valueTmp,
                dialogInputLength: lengthTmp,
                iuputTmp: valueTmp
            });
        },

        myConfirm(event, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(event, _dataset);
            /* ---处理dataset end--- */
            console.log(event.currentTarget.id);
            let inputType = event.currentTarget.id;
            let that = this;
            var temp = that.userFrom;
            switch (inputType) {
                case 'nameclickchg':
                    if (that.iuputTmp.length == 0) {
                        showErrorMsg('昵称未输入');
                        return;
                    }
                    temp.name = that.iuputTmp;
                    that.setData({
                        userFrom: temp
                    });
                    break;
                case 'addressclickchg':
                    if (that.iuputTmp.length == 0) {
                        showErrorMsg('地址未输入');
                        return;
                    }
                    temp.address = that.iuputTmp;
                    that.setData({
                        userFrom: temp
                    });
                    break;
                case 'emailclickchg':
                    if (that.iuputTmp.length == 0) {
                        showErrorMsg('邮箱未输入');
                        return;
                    }
                    let pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                    if (!pattern.test(that.iuputTmp)) {
                        showErrorMsg('邮箱格式不正确');
                        return;
                    }
                    temp.email = that.iuputTmp;
                    that.setData({
                        userFrom: temp
                    });
                    break;
                case 'phoneclickchg':
                    if (that.iuputTmp.length == 0) {
                        showErrorMsg('手机未输入');
                        return;
                    }
                    let phonePattern = /^1[0-9]{10}$/;
                    if (!phonePattern.test(that.iuputTmp)) {
                        showErrorMsg('手机格式不正确');
                        return;
                    }
                    temp.phone = that.iuputTmp;
                    that.setData({
                        userFrom: temp
                    });
                    break;
                default:
                    break;
            }
            uni.setStorage({
                key: 'userinfo',
                data: temp
            });
        },

        onChange(event) {
            // event.detail 为当前输入的值
            this.setData({
                iuputTmp: event.detail
            });
        },

        onClose(e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            this.setData({
                iuputTmp: ''
            });
        },

        genderChange(e) {
            let that = this;
            let temp = that.userFrom;
            temp.gender = e.detail.value;
            that.setData({
                userFrom: temp
            });
            uni.setStorage({
                key: 'userinfo',
                data: temp
            });
        },

        birthdayChange(e) {
            let that = this;
            let temp = that.userFrom;
            temp.birthday = e.detail.value;
            that.setData({
                userFrom: temp
            });
            uni.setStorage({
                key: 'userinfo',
                data: temp
            });
        },

        openGuidance(e) {
            this.setData({
                showGuidance: true
            });
        },

        closeGuidance(e) {
            this.setData({
                showGuidance: false
            });
        },

        readGuidance(event, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(event, _dataset);
            /* ---处理dataset end--- */
            let that = this;
            console.info(event);
            if (event.type == 'confirm') {
                that.getUserInit();
            } else {
                uni.switchTab({
                    url: '/pages/index/index'
                });
            }
        },

        showGuidanceDiagFun() {
            this.setData({
                showGuidanceDiag: true
            });
        }
    }
};
</script>
<style lang="scss">
/* pages/mine-info/mine-info.wxss */
Page {
    background-color: var(--themeColor_gray);
}
.cell-other {
    margin-top: 20rpx;
    display: block;
}
.avatar {
    display: inline-block;
    width: 60rpx;
    height: 60rpx;
}
.avatar-wrapper {
    width: 600rpx;
    height: 100rpx;
    position: absolute;
    top: 0rpx;
    left: 120rpx;
    opacity: 0;
}

.popupbg {
    font-size: 28rpx;
    color: rgb(85, 83, 83);
}
</style>
