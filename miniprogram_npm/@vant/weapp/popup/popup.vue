<template>
    <view
        v-if="inited"
        :class="'custom-class ' + classes + ' ' + utils.bem('popup', [position, { round, safe: safeAreaInsetBottom, safeTop: safeAreaInsetTop, safeTabBar: safeAreaTabBar }])"
        :style="computed.popupStyle({ zIndex, currentDuration, display, customStyle })"
        @transitionend="onTransitionEnd"
    >
        <slot />
        <van-icon v-if="closeable" :name="closeIcon" :class="'close-icon-class van-popup__close-icon van-popup__close-icon--' + closeIconPosition" @tap.native="onClickCloseIcon" />
    </view>
</template>

<script>
export default {
    props: ['data', 'compName'],
    computed: {
        inited() {
            return this.data.inited;
        },
        classes() {
            return this.data.classes;
        },
        closeable() {
            return this.data.closeable;
        },
        closeIcon() {
            return this.data.closeIcon;
        },
        closeIconPosition() {
            return this.data.closeIconPosition;
        },
        onTransitionEnd() {
            return this.data.onTransitionEnd;
        },
        onClickCloseIcon() {
            return this.data.onClickCloseIcon;
        }
    }
};
</script>
<style></style>
