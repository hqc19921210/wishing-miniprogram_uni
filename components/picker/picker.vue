<template>
    <!-- picker/picker.wxml -->
    <view :class="'full-box ' + (isOpen ? 'cur' : '')">
        <!-- <view class="modal" bindtap="tapModal"></view> -->
        <view class="picker">
            <view class="picker-header" :style="pickerHeaderStyle">
                <view @tap="cancle">
                    <text :style="cancelStyle">{{ cancelText }}</text>
                </view>
                <text :style="titleStyle">{{ titleText }}</text>
                <view @tap="sure">
                    <text :style="sureStyle">{{ sureText }}</text>
                </view>
            </view>
            <picker-view
                :value="value"
                class="picker-content"
                @pickstart="bindpickstartFun"
                @change="bindChangeFun"
                @pickend="bindpickendFun"
                :indicator-style="indicatorStyle"
                :mask-style="maskStyle"
            >
                <picker-view-column v-for="(item, index) in columnsData" :key="index">
                    <view class="picker-line" v-for="(itemIn, index1) in item" :key="index1">
                        <text class="line1" :style="chooseItemTextStyle">{{ isUseKeywordOfShow ? itemIn[keyWordsOfShow] : itemIn }}</text>
                    </view>
                </picker-view-column>
            </picker-view>
        </view>
    </view>
</template>

<script>
// picker/picker.js
import { isPlainObject } from './tool';
export default {
    data() {
        return {
            columnsData: [],
            value: [],
            backData: [],
            height: 0,
            isOpen: false,
            isUseKeywordOfShow: false,
            scrollEnd: true,
            // 滚动是否结束
            lastValue: [],
            // 上次各个colum的选择索引
            tempValue: [],
            isFirstOpen: true,
            onlyKey: '',
            defaultPickDataTemp: '',
            listDataTemp: ''
        };
    },
    /**
     * 组件的属性列表
     */
    props: {
        scrollType: {
            type: String,
            default: 'normal' // "link": scroll间联动  "normal": scroll相互独立
        },

        listData: {
            type: Array,
            default: () => []
        },

        defaultPickData: {
            type: Array,
            default: () => []
        },
        keyWordsOfShow: {
            type: String,
            default: 'name'
        },
        isShowPicker: {
            type: Boolean,
            default: false
        },
        titleText: {
            // 标题文案
            type: String,
            default: '标题'
        },
        cancelText: {
            // 取消按钮文案
            type: String,
            default: '取消'
        },
        sureText: {
            // 确定按钮文案
            type: String,
            default: '确定'
        },
        pickerHeaderStyle: String,
        // 标题栏样式 view
        sureStyle: String,
        // 标题栏确定样式  text
        cancelStyle: String,
        // 标题栏取消样式 text
        titleStyle: String,
        // 标题栏标题样式  view
        maskStyle: String,
        // 设置蒙层的样式（详见picker-view） view
        indicatorStyle: String,
        // 设置选择器中间选中框的样式（详见picker-view） view
        chooseItemTextStyle: String // 设置picker列表文案样式 text
    },
    /**
     * 组件的方法列表
     */
    methods: {
        tapModal() {
            this.isShowPicker = false;
            this.closePickerFun();
        },
        cancle() {
            this.$emit('cancle');
            this.closePickerFun();
        },
        sure() {
            const { scrollEnd, tempValue } = this;
            if (!scrollEnd) {
                return;
            }
            const backData = this.getBackDataFromValueFun(tempValue);
            this.setData({
                backData
            });
            this.$emit('sure', {
                detail: {
                    choosedData: backData,
                    choosedIndexArr: tempValue
                }
            });
            this.closePickerFun();
        },
        bindChangeFun(e) {
            const { scrollType } = this;
            const { lastValue } = this;
            let val = e.detail.value;
            switch (scrollType) {
                case 'normal':
                    this.tempValue = val.concat();
                    this.tempValue = val.concat();
                    break;
                case 'link':
                    // let column_02 = this._getColumnData(this.properties.listData[val[0]].children);
                    // let column_03 = this._getColumnData(this.properties.listData[val[0]].children[val[1]].children);
                    var tempArray = [];
                    if (val.length > 1) {
                        val.slice(0, val.length - 1).reduce((t, c, i) => {
                            const v = t[c].children;
                            tempArray.push(this.getColumnDataFun(v));
                            return v;
                        }, this.listData);
                    }
                    // let columnsData = [this.data.columnsData[0],column_02,column_03];
                    var columnsData = [this.columnsData[0], ...tempArray];

                    // 设置value关联
                    var compareIndex = this.getScrollCompareIndexFun(lastValue, val);
                    if (compareIndex > -1) {
                        let tempI = 1;
                        while (val[compareIndex + tempI] !== undefined) {
                            val[compareIndex + tempI] = 0;
                            tempI++;
                        }
                    }
                    val = this.validateFun(val);
                    this.lastValue = val.concat();
                    this.tempValue = val.concat();
                    this.setData({
                        columnsData
                        // value: val
                    });
            }
        },

        validateFun(val) {
            const { columnsData } = this;
            columnsData.forEach((v, i) => {
                if (columnsData[i].length - 1 < val[i]) {
                    val[i] = columnsData[i].length - 1;
                }
            });
            this.setData({
                value: val
            });
            return val;
        },
        bindpickendFun() {
            this.scrollEnd = true;
        },
        bindpickstartFun() {
            this.scrollEnd = false;
        },
        openPickerFun() {
            if (!this.isFirstOpen) {
                if (this.listData.length !== 0) {
                    this.setDefaultFun(this.computedBackDataFun(this.backData));
                }
            }
            this.isFirstOpen = false;
            this.setData({
                isOpen: true
            });
        },
        closePickerFun() {
            this.setData({
                isOpen: false
            });
        },
        getColumnDataFun(arr) {
            return arr.map((v) => this.fomateObjFun(v));
        },
        fomateObjFun(o) {
            const tempO = {};
            for (const k in o) {
                if (k !== 'children') {
                    tempO[k] = o[k];
                }
            }
            return tempO;
        },
        getScrollCompareIndexFun(arr1, arr2) {
            let tempIndex = -1;
            for (let i = 0, len = arr1.length; i < len; i++) {
                if (arr1[i] !== arr2[i]) {
                    tempIndex = i;
                    break;
                }
            }
            return tempIndex;
        },
        // 根据id获取索引
        getIndexByIdOfObjectFun(listData, idArr, key, arr) {
            if (!Array.isArray(listData)) {
                return;
            }
            for (let i = 0, len = listData.length; i < len; i++) {
                if (listData[i][key] === idArr[arr.length][key]) {
                    arr.push(i);
                    return this.getIndexByIdOfObjectFun(listData[i].children, idArr, key, arr);
                }
            }
        },
        setDefaultFun(inBackData) {
            const { scrollType } = this;
            let { listData, defaultPickData } = this;
            const { lastValue } = this;
            if (inBackData) {
                defaultPickData = inBackData;
            }
            let backData = [];
            switch (scrollType) {
                case 'normal':
                    if (isPlainObject(listData[0][0])) {
                        this.setData({
                            isUseKeywordOfShow: true
                        });
                    }
                    if (Array.isArray(defaultPickData) && defaultPickData.length > 0) {
                        backData = listData.map((v, i) => v[defaultPickData[i]]);
                        this.tempValue = defaultPickData;
                        this.lastValue = defaultPickData;
                    } else {
                        backData = listData.map((v) => v[0]);
                    }
                    this.setData({
                        columnsData: listData,
                        backData: backData,
                        value: defaultPickData
                    });
                    break;
                case 'link':
                    // let column_01 = this._getColumnData(newVal);
                    // let column_02 = this._getColumnData(newVal[0].children);
                    // let column_03 = this._getColumnData(newVal[0].children[0].children);
                    // let columnsData = [column_01,column_02,column_03];
                    var columnsData = [];
                    // 如果默认值
                    if (Array.isArray(defaultPickData) && defaultPickData.length > 0 && defaultPickData.every((v, i) => isPlainObject(v))) {
                        const key = (this.onlyKey = Object.keys(defaultPickData[0])[0]);
                        const arr = [];
                        this.getIndexByIdOfObjectFun(listData, defaultPickData, key, arr);
                        defaultPickData = arr;
                        let tempI = 0;
                        do {
                            lastValue.push(defaultPickData[tempI]);
                            columnsData.push(this.getColumnDataFun(listData));
                            listData = listData[defaultPickData[tempI]].children;
                            tempI++;
                        } while (listData);
                        backData = columnsData.map((v, i) => v[defaultPickData[i]]);
                        // 如果没有默认值
                    } else {
                        this.onlyKey = this.keyWordsOfShow || 'name';
                        do {
                            lastValue.push(0);
                            columnsData.push(this.getColumnDataFun(listData));
                            listData = listData[0].children;
                        } while (listData);
                        backData = columnsData.map((v) => v[0]);
                    }
                    this.tempValue = defaultPickData;
                    this.lastValue = defaultPickData;
                    this.setData({
                        isUseKeywordOfShow: true,
                        columnsData,
                        backData
                    });
                    setTimeout(() => {
                        this.setData({
                            value: defaultPickData
                        });
                    }, 0);
                    break;
            }
        },
        computedBackDataFun(backData) {
            const { scrollType, listData } = this;
            const { onlyKey } = this;
            if (scrollType === 'normal') {
                return backData.map((v, i) => listData[i].findIndex((vv, ii) => this.compareObjFun(v, vv)));
            } else {
                const t = backData.map((v, i) => {
                    const o = {};
                    o[onlyKey] = v[onlyKey];
                    return o;
                });
                return t;
            }
        },
        compareObjFun(o1, o2) {
            const { keyWordsOfShow } = this;
            if (typeof o1 !== 'object') {
                return o1 === o2;
            } else {
                return o1[keyWordsOfShow] === o2[keyWordsOfShow];
            }
        },
        getBackDataFromValueFun(val) {
            let tempArr = [];
            if (val.length > 0) {
                tempArr = this.columnsData.reduce((t, v, i) => {
                    return t.concat(v[val[i]]);
                }, []);
            } else {
                tempArr = this.columnsData.map((v, i) => v[0]);
            }
            return tempArr;
        },
        compareDateFun() {
            // 完全相等返回true
            const { defaultPickDataTemp, listDataTemp } = this;
            const { defaultPickData, listData } = this;
            return defaultPickDataTemp === defaultPickData && listDataTemp === listData;
        },
        setTempDataFun() {
            const { defaultPickData, listData } = this;
            this.defaultPickDataTemp = defaultPickData;
            this.listDataTemp = listData;
        }
    },
    created: function () {},
    watch: {
        listData: {
            handler: function (newVal) {
                if (newVal.length === 0 || this.compareDateFun()) {
                    return;
                }
                this.setTempDataFun();
                const tempArr = [...new Array(newVal.length).keys()].map(() => 0);
                this.lastValue = this.tempValue = tempArr;
                this.setDefaultFun();

                // let {defaultPickData} = this.properties;
                // if(newVal.length === 0) return;
                //
                // this._setDefault(newVal, defaultPickData)
            },

            immediate: true,
            deep: true
        },

        defaultPickData: {
            handler: function (newVal) {
                if (newVal.length === 0 || this.compareDateFun()) {
                    return;
                }
                this.setTempDataFun();
                this.setDefaultFun();
            },

            immediate: true,
            deep: true
        },

        isShowPicker: {
            handler: function (newVal) {
                if (newVal) {
                    this.openPickerFun();
                } else {
                    this.closePickerFun();
                }
            },

            immediate: true
        }
    }
};
</script>
<style>
/* picker/picker.wxss */
.full-box {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 9999;
    opacity: 0;
    background: rgba(0, 0, 0, 0.4);
    transition: all 0.4s ease-in-out 0;
    pointer-events: none;
}
.full-box.cur {
    opacity: 1;
    pointer-events: auto;
}

.modal {
    position: absolute;
    width: 100%;
    height: 50%;
    bottom: -50%;
    left: 0;
    background: transparent;
    transition: all 0.4s ease-in-out 0;
}

.picker {
    position: absolute;
    width: 100%;
    height: 235px;
    bottom: -235px;
    left: 0;
    background: #fff;
    display: flex;
    flex-direction: column;
    transition: all 0.4s ease-in-out 0;
}

.cur .picker {
    bottom: 0;
}
.cur .modal {
    bottom: 50%;
}
.picker-line {
    display: flex;
    justify-content: center;
    align-items: center;
}
.picker-header {
    height: 20%;
    box-sizing: border-box;
    padding: 0 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
}
.picker-header view {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.picker-header view text {
    font-size: 36rpx;
}
.picker-content {
    flex-grow: 1;
}
.line1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    lines: 1;
}
</style>
