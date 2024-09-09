<template>
    <view>
        <van-cell
            :size="size"
            :icon="leftIcon"
            :center="center"
            :border="border"
            :is-link="isLink"
            :required="required"
            :clickable="clickable"
            :title-width="titleWidth"
            title-style="margin-right: 12px;"
            :custom-style="customStyle"
            :arrow-direction="arrowDirection"
            custom-class="van-field"
        >
            <slot name="left-icon" slot="icon" />
            <view v-if="label" :class="'label-class ' + utils.bem('field__label', { disabled })" slot="title">
                {{ label }}
            </view>
            <slot v-else name="label" slot="title" />
            <view :class="utils.bem('field__body', [type])">
                <view :class="utils.bem('field__control', [inputAlign, 'custom'])" @tap="onClickInput">
                    <slot name="input" />
                </view>
                <Textarea v-if="type === 'textarea'" :data="this"></Textarea>
                <Input v-else :data="this"></Input>

                <van-icon v-if="showClear" :name="clearIcon" class="van-field__clear-root van-field__icon-root" @touchstart.native.stop.prevent="onClear" />
                <view class="van-field__icon-container" @tap="onClickIcon">
                    <van-icon v-if="rightIcon || icon" :name="rightIcon || icon" :class="'van-field__icon-root ' + iconClass" custom-class="right-icon-class" />
                    <slot name="right-icon" />
                    <slot name="icon" />
                </view>
                <view class="van-field__button">
                    <slot name="button" />
                </view>
            </view>
            <view v-if="showWordLimit && maxlength" class="van-field__word-limit">
                <view :class="utils.bem('field__word-num', { full: value.length >= maxlength })">{{ value.length >= maxlength ? maxlength : value.length }}</view>
                /{{ maxlength }}
            </view>
            <view v-if="errorMessage" :class="utils.bem('field__error-message', [errorMessageAlign, { disabled, error }])">
                {{ errorMessage }}
            </view>
        </van-cell>
    </view>
</template>
<script module="utils" lang="wxs" src="@/miniprogram_npm/@vant/weapp/wxs/utils.wxs"></script>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/field/index.wxs"></script>
<script>
'use strict';
import Textarea from './textarea.vue';
import Input from './input.vue';
var __assign =
    (this && this.__assign) ||
    function () {
        __assign =
            Object.assign ||
            function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s) {
                        if (Object.prototype.hasOwnProperty.call(s, p)) {
                            t[p] = s[p];
                        }
                    }
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };
Object.defineProperty(exports, '__esModule', {
    value: true
});
var utils_1 = require('../common/utils');
var component_1 = require('../common/component');
var props_1 = require('./props');
export default {
    components: {
        Textarea,
        Input
    },
    data() {
        return {
            focused: false,
            innerValue: '',
            showClear: false,
            value: '',
            size: '',
            leftIcon: 0,
            center: '',
            border: '',
            isLink: false,
            required: '',
            clickable: '',
            titleWidth: 0,
            customStyle: '',
            arrowDirection: [],
            label: '',
            type: '',
            this: [],
            clearIcon: '',
            rightIcon: '',
            icon: '',
            iconClass: '',
            showWordLimit: '',
            maxlength: '',
            errorMessage: ''
        };
    },
    field: true,
    classes: ['input-class', 'right-icon-class', 'label-class'],
    props: __assign(__assign(__assign(__assign({}, props_1.commonProps), props_1.inputProps), props_1.textareaProps), {
        size: String,
        icon: String,
        label: String,
        error: Boolean,
        center: Boolean,
        isLink: Boolean,
        leftIcon: String,
        rightIcon: String,
        autosize: null,
        required: Boolean,
        iconClass: String,
        clickable: Boolean,
        inputAlign: String,
        customStyle: String,
        errorMessage: String,
        arrowDirection: String,
        showWordLimit: Boolean,
        errorMessageAlign: String,
        readonly: {
            type: Boolean,
            observer: 'setShowClear'
        },
        clearable: {
            type: Boolean,
            observer: 'setShowClear'
        },
        clearTrigger: {
            type: String,
            value: 'focus'
        },
        border: {
            type: Boolean,
            value: true
        },
        titleWidth: {
            type: String,
            value: '6.2em'
        },
        clearIcon: {
            type: String,
            value: 'clear'
        },
        extraEventParams: {
            type: Boolean,
            value: false
        }
    }),
    created: function () {
        this.value = this.value;
        this.setData({
            innerValue: this.value
        });
    },
    methods: {
        formatValue: function (value) {
            var maxlength = this.maxlength;
            if (maxlength !== -1 && value.length > maxlength) {
                return value.slice(0, maxlength);
            }
            return value;
        },
        onInput: function (event) {
            var _a = (event.detail || {}).value;
            var value = _a === void 0 ? '' : _a;
            var formatValue = this.formatValue(value);
            this.value = formatValue;
            this.setShowClear();
            return this.emitChange(
                __assign(__assign({}, event.detail), {
                    value: formatValue
                })
            );
        },
        onFocus: function (event) {
            this.focused = true;
            this.setShowClear();
            this.$emit('focus', event.detail);
        },
        onBlur: function (event) {
            this.focused = false;
            this.setShowClear();
            this.$emit('blur', event.detail);
        },
        onClickIcon: function () {
            this.$emit('click-icon');
        },
        onClickInput: function (event) {
            this.$emit('click-input', event.detail);
        },
        onClear: function () {
            var that = this;
            this.setData({
                innerValue: ''
            });
            this.value = '';
            this.setShowClear();
            (0, utils_1.nextTick)(function () {
                that.emitChange({
                    value: ''
                });
                that.$emit('clear', '');
            });
        },
        onConfirm: function (event) {
            var _a = (event.detail || {}).value;
            var value = _a === void 0 ? '' : _a;
            this.value = value;
            this.setShowClear();
            this.$emit('confirm', value);
        },
        setValue: function (value) {
            this.value = value;
            this.setShowClear();
            if (value === '') {
                this.setData({
                    innerValue: ''
                });
            }
            this.emitChange({
                value: value
            });
        },
        onLineChange: function (event) {
            this.$emit('linechange', event.detail);
        },
        onKeyboardHeightChange: function (event) {
            this.$emit('keyboardheightchange', event.detail);
        },
        emitChange: function (detail) {
            var extraEventParams = this.extraEventParams;
            this.setData({
                value: detail.value
            });
            var result;
            var data = extraEventParams
                ? __assign(__assign({}, detail), {
                      callback: function (data) {
                          result = data;
                      }
                  })
                : detail.value;
            this.$emit('input', data);
            this.$emit('change', data);
            return result;
        },
        setShowClear: function () {
            var _a = this;
            var clearable = _a.clearable;
            var readonly = _a.readonly;
            var clearTrigger = _a.clearTrigger;
            var that = this;
            var focused = that.focused;
            var value = that.value;
            var showClear = false;
            if (clearable && !readonly) {
                var hasValue = !!value;
                var trigger = clearTrigger === 'always' || (clearTrigger === 'focus' && focused);
                showClear = hasValue && trigger;
            }
            this.setData({
                showClear: showClear
            });
        },
        noop: function () {}
    }
};
</script>
<style>
@import '../common/index.css';
.van-field {
    --cell-icon-size: var(--field-icon-size, 16px);
}
.van-field__label {
    color: var(--field-label-color, #646566);
}
.van-field__label--disabled {
    color: var(--field-disabled-text-color, #c8c9cc);
}
.van-field__body {
    align-items: center;
    display: flex;
}
.van-field__body--textarea {
    box-sizing: border-box;
    line-height: 1.2em;
    min-height: var(--cell-line-height, 24px);
    padding: 3.6px 0;
}
.van-field__control:empty + .van-field__control {
    display: block;
}
.van-field__control {
    background-color: initial;
    border: 0;
    box-sizing: border-box;
    color: var(--field-input-text-color, #323233);
    display: none;
    height: var(--cell-line-height, 24px);
    line-height: inherit;
    margin: 0;
    min-height: var(--cell-line-height, 24px);
    padding: 0;
    position: relative;
    resize: none;
    text-align: left;
    width: 100%;
}
.van-field__control:empty {
    display: none;
}
.van-field__control--textarea {
    height: var(--field-text-area-min-height, 18px);
    min-height: var(--field-text-area-min-height, 18px);
}
.van-field__control--error {
    color: var(--field-input-error-text-color, #ee0a24);
}
.van-field__control--disabled {
    background-color: initial;
    color: var(--field-input-disabled-text-color, #c8c9cc);
    opacity: 1;
}
.van-field__control--center {
    text-align: center;
}
.van-field__control--right {
    text-align: right;
}
.van-field__control--custom {
    align-items: center;
    display: flex;
    min-height: var(--cell-line-height, 24px);
}
.van-field__placeholder {
    color: var(--field-placeholder-text-color, #c8c9cc);
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
}
.van-field__placeholder--error {
    color: var(--field-error-message-color, #ee0a24);
}
.van-field__icon-root {
    align-items: center;
    display: flex;
    min-height: var(--cell-line-height, 24px);
}
.van-field__clear-root,
.van-field__icon-container {
    line-height: inherit;
    margin-right: calc(var(--padding-xs, 8px) * -1);
    padding: 0 var(--padding-xs, 8px);
    vertical-align: middle;
}
.van-field__button,
.van-field__clear-root,
.van-field__icon-container {
    flex-shrink: 0;
}
.van-field__clear-root {
    color: var(--field-clear-icon-color, #c8c9cc);
    font-size: var(--field-clear-icon-size, 16px);
}
.van-field__icon-container {
    color: var(--field-icon-container-color, #969799);
    font-size: var(--field-icon-size, 16px);
}
.van-field__icon-container:empty {
    display: none;
}
.van-field__button {
    padding-left: var(--padding-xs, 8px);
}
.van-field__button:empty {
    display: none;
}
.van-field__error-message {
    color: var(--field-error-message-color, #ee0a24);
    font-size: var(--field-error-message-text-font-size, 12px);
    text-align: left;
}
.van-field__error-message--center {
    text-align: center;
}
.van-field__error-message--right {
    text-align: right;
}
.van-field__word-limit {
    color: var(--field-word-limit-color, #646566);
    font-size: var(--field-word-limit-font-size, 12px);
    line-height: var(--field-word-limit-line-height, 16px);
    margin-top: var(--padding-base, 4px);
    text-align: right;
}
.van-field__word-num {
    display: inline;
}
.van-field__word-num--full {
    color: var(--field-word-num-full-color, #ee0a24);
}
</style>
