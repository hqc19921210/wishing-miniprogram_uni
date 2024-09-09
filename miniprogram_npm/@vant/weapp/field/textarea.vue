<template>
    <view>
        <textarea
            :class="utils.bem('field__control', [inputAlign, type, { disabled, error }]) + ' input-class'"
            :fixed="fixed"
            :focus="focus"
            :cursor="cursor"
            :value="innerValue"
            :auto-focus="autoFocus"
            :disabled="disabled || readonly"
            :maxlength="maxlength"
            :placeholder="placeholder"
            :placeholder-style="placeholderStyle"
            :placeholder-class="utils.bem('field__placeholder', { error, disabled })"
            :auto-height="!!autosize"
            :style="computed.inputStyle(autosize)"
            :cursor-spacing="cursorSpacing"
            :adjust-position="adjustPosition"
            :show-confirm-bar="showConfirmBar"
            :hold-keyboard="holdKeyboard"
            :selection-end="selectionEnd"
            :selection-start="selectionStart"
            :disable-default-padding="disableDefaultPadding"
            @input="onInput"
            @tap="onClickInput"
            @blur="onBlur"
            @focus="onFocus"
            @confirm="onConfirm"
            @linechange="onLineChange"
            @keyboardheightchange="onKeyboardHeightChange"
        />
    </view>
</template>

<script>
export default {
    props: ['data', 'compName'],
    computed: {
        fixed() {
            return this.data.fixed;
        },
        focus() {
            return this.data.focus;
        },
        cursor() {
            return this.data.cursor;
        },
        innerValue() {
            return this.data.innerValue;
        },
        autoFocus() {
            return this.data.autoFocus;
        },
        disabled() {
            return this.data.disabled;
        },
        readonly() {
            return this.data.readonly;
        },
        maxlength() {
            return this.data.maxlength;
        },
        placeholder() {
            return this.data.placeholder;
        },
        placeholderStyle() {
            return this.data.placeholderStyle;
        },
        autosize() {
            return this.data.autosize;
        },
        cursorSpacing() {
            return this.data.cursorSpacing;
        },
        adjustPosition() {
            return this.data.adjustPosition;
        },
        showConfirmBar() {
            return this.data.showConfirmBar;
        },
        holdKeyboard() {
            return this.data.holdKeyboard;
        },
        selectionEnd() {
            return this.data.selectionEnd;
        },
        selectionStart() {
            return this.data.selectionStart;
        },
        disableDefaultPadding() {
            return this.data.disableDefaultPadding;
        },
        onInput() {
            return this.data.onInput;
        },
        onClickInput() {
            return this.data.onClickInput;
        },
        onBlur() {
            return this.data.onBlur;
        },
        onFocus() {
            return this.data.onFocus;
        },
        onConfirm() {
            return this.data.onConfirm;
        },
        onLineChange() {
            return this.data.onLineChange;
        },
        onKeyboardHeightChange() {
            return this.data.onKeyboardHeightChange;
        }
    }
};
</script>
<style></style>
