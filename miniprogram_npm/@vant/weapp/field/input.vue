<template>
    <view>
        <input
            :class="utils.bem('field__control', [inputAlign, { disabled, error }]) + ' input-class'"
            :type="type"
            :focus="focus"
            :cursor="cursor"
            :value="innerValue"
            :auto-focus="autoFocus"
            :disabled="disabled || readonly"
            :maxlength="maxlength"
            :placeholder="placeholder"
            :placeholder-style="placeholderStyle"
            :placeholder-class="utils.bem('field__placeholder', { error })"
            :confirm-type="confirmType"
            :confirm-hold="confirmHold"
            :hold-keyboard="holdKeyboard"
            :cursor-spacing="cursorSpacing"
            :adjust-position="adjustPosition"
            :selection-end="selectionEnd"
            :selection-start="selectionStart"
            :always-embed="alwaysEmbed"
            :password="password || type === 'password'"
            @input="onInput"
            @tap="onClickInput"
            @blur="onBlur"
            @focus="onFocus"
            @confirm="onConfirm"
            @keyboardheightchange="onKeyboardHeightChange"
        />
    </view>
</template>

<script>
export default {
    props: ['data', 'compName'],
    computed: {
        type() {
            return this.data.type;
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
        confirmType() {
            return this.data.confirmType;
        },
        confirmHold() {
            return this.data.confirmHold;
        },
        holdKeyboard() {
            return this.data.holdKeyboard;
        },
        cursorSpacing() {
            return this.data.cursorSpacing;
        },
        adjustPosition() {
            return this.data.adjustPosition;
        },
        selectionEnd() {
            return this.data.selectionEnd;
        },
        selectionStart() {
            return this.data.selectionStart;
        },
        alwaysEmbed() {
            return this.data.alwaysEmbed;
        },
        password() {
            return this.data.password;
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
        onKeyboardHeightChange() {
            return this.data.onKeyboardHeightChange;
        }
    }
};
</script>
<style></style>
