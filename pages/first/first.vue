<template>
    <view>
        <!-- <image class="bg" src="https://yssl.com.cn/attachment/test/first.png" mode="aspectFill"></image>
	<van-count-down use-slot time="{{ time }}" bind:change="onChange">
	<view class="count-down">
		<text class="item">{{ timeData.seconds }}</text>
	</view>
	</van-count-down> -->
        <view class="bg" style="background-color: red">
            <view class="text-center" style="margin-top: 370rpx">
                <image src="/static/images/bg_1.png" style="height: 280rpx; width: 240rpx" mode="aspectFit"></image>
            </view>

            <view class="text-center" :style="'margin-top: ' + marginTop + 'px;'">
                <image src="/static/images/bg_2.png" style="height: 300rpx; width: 400rpx" mode="aspectFit"></image>
            </view>

            <!-- <view style="position: fixed; bottom: 260rpx; left: 200rpx;">
			<image src="/images/bg_2.png" style="height: 256rpx; width: 354rpx;" mode="aspectFill"></image>
		</view> -->

            <view style="font-size: 20rpx; color: #028ed5; text-align: center; width: 350rpx; position: fixed; bottom: 50rpx; left: 200rpx">桂ICP备2023007429号-2X</view>
        </view>
    </view>
</template>

<script>
// pages/first/first.js
export default {
    data() {
        return {
            marginTop: 0
        };
    }, // onChange(e) {
    //   console.info( e.detail)
    //   if(e.detail.seconds <1){
    //       wx.switchTab({
    //         url: '/pages/home/home',
    //       })
    //   }
    //   this.setData({
    //     timeData: e.detail,
    //   });
    // },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var barInfo = uni.getStorageSync('barInfo'); //获取缓存中的高度
        this.setData({
            marginTop: barInfo.fullViewHeight * 0.1
        });
        setTimeout(() => {
            uni.switchTab({
                url: '/pages/index/index'
            });
        }, 4000);
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {},
    methods: {}
};
</script>
<style lang="scss">
/* components/wishing-bg/wishing-bg.wxss */
.bg {
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
    z-index: -1;
    /* 通过滤镜增加毛玻璃效果 filter: blur(10rpx); */
    /*颜色渐变*/
    background: -webkit-linear-gradient(top, #0073c8, #aff1f9);
}

/* .count-down{*/
/* 	height: 70rpx;*/
/* 	width:70rpx;*/
/* 	border-radius: 50%;*/
/* 	background-color: #F5F5F5;*/
/* 	position: fixed;*/
/* 	top: 200rpx;*/
/* 	right: 20rpx;*/
/* 	//放在正中心*/
/* 	display: flex;*/
/* 	justify-content: center;*/
/* 	align-items: center;*/

/* 	.item{*/
/* 		color: black;*/
/* 		font-size: 35rpx;*/
/* 		font-weight: 600;*/

/* 	}*/
/* }*/
</style>
