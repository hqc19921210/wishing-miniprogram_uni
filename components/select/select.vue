<template>
    <view class="select-box">
        <view class="select-current" @tap.stop.prevent="openClose">
            <text class="current-name" v-if="current.name">{{ current.name }}</text>
            <text class="input-show" v-else-if="">{{ title }}</text>
            <text class="select-icon" v-if="!disable"></text>
        </view>
        <view class="option-list" v-if="isShow && !disable" @tap.stop.prevent="optionTap">
            <!-- <text class="option" wx:if="{{defaultOption.id || defaultOption.name}}"
      data-id="{{defaultOption.id}}"
      data-name="{{defaultOption.name}}">{{defaultOption.name}}
    </text> -->

            <text class="option" :data-id="item.id" :data-name="item.name" v-for="(item, index) in result" :key="index">{{ item.name }}</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            result: [],
            isShow: false,
            currentClone: {}
        };
    },
    props: {
        options: {
            type: Array,
            default: () => []
        },
        defaultOption: {
            type: Object,
            default: () => ({
                id: '',
                name: ''
            })
        },
        key: {
            type: String,
            default: 'id'
        },
        text: {
            type: String,
            default: 'name'
        },
        title: {
            type: String,
            default: '请选择...'
        },
        disable: {
            type: Boolean,
            default: false
        },
        current: {
            type: Object,
            default: () => ({
                id: '',
                name: ''
            })
        }
    },
    methods: {
        attached() {
            // 属性名称转换, 如果不是 { id: '', name:'' } 格式，则转为 { id: '', name:'' } 格式
            let result = [];

            // if (this.data.key !== 'id' || this.data.text !== 'name') {
            //   for (let item of this.data.options) {
            //     let { [this.data.key]: id, [this.data.text]: name } = item
            //     result.push({ id, name })
            //   }
            // }else{

            // }
            for (let item of this.options) {
                let { [this.key]: id, [this.text]: name } = item;
                result.push({
                    id,
                    name
                });
            }
            this.setData({
                current: Object.assign({}, this.defaultOption),
                result: result
            });
        },

        optionTap(e) {
            let dataset = e.target.dataset;
            this.setData({
                current: dataset,
                isShow: false
            });

            // 调用父组件方法，并传参
            this.$emit('change', {
                detail: {
                    ...dataset
                }
            });
        },

        openClose() {
            this.setData({
                isShow: !this.isShow
            });
        },

        // 此方法供父组件调用
        close() {
            this.setData({
                isShow: false
            });
        }
    },
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },
    created: function () {}
};
</script>
<style>
.select-box {
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 30rpx;
}

.select-current {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 10rpx;
    /* line-height: 70rpx; */
    /* border-radius: 6rpx; */
    box-sizing: border-box;
}
/* .select-current::after { */
.select-icon {
    position: absolute;
    display: block;
    right: 16rpx;
    top: 30rpx;
    content: '';
    width: 0;
    height: 0;
    border: 10rpx solid transparent;
    border-top: 10rpx solid #e11d4d;
}

.current-name {
    font-size: 28rpx;
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

.input-show {
    display: block;
    width: 85%;
    height: 100%;
    word-wrap: normal;
    overflow: hidden;
    color: #acacac;
    justify-content: center;
    /**垂直方向居中**/
    display: flex;
    align-items: center;
}

.option-list {
    /* position: absolute;
  left: 0;
  top: 76rpx; */
    margin-top: 2rpx;
    width: 100%;
    padding: 12rpx 20rpx 10rpx 20rpx;
    border-radius: 6rpx;
    box-sizing: border-box;
    z-index: 99;
    box-shadow: 0rpx 0rpx 1rpx 1rpx rgba(0, 0, 0, 0.2) inset;
    background-color: #fff;
    position: relative;
    z-index: 10;
}

.option {
    display: block;
    width: 100%;
    line-height: 70rpx;
    border-bottom: 1rpx solid #eee;
    background-color: #fff;
    z-index: 10;
    position: relative;
}

.option:last-child {
    border-bottom: none;
    padding-bottom: 0;
}
</style>
