<template>
    <view>
        <van-transition
            :show="show"
            custom-class="van-overlay custom-class"
            :custom-style="'z-index: ' + zIndex + '; ' + customStyle"
            :duration="duration"
            @tap.native="onClick"
            @touchmove.native.stop.prevent="parseEventDynamicCode($event, lockScroll ? 'noop' : '')"
        >
            <slot></slot>
        </van-transition>
    </view>
</template>

<script>
export default {
    props: ['data', 'compName'],
    computed: {
        show() {
            return this.data.show;
        },
        zIndex() {
            return this.data.zIndex;
        },
        customStyle() {
            return this.data.customStyle;
        },
        duration() {
            return this.data.duration;
        },
        onClick() {
            return this.data.onClick;
        },
        lockScroll() {
            return this.data.lockScroll;
        }
    }
};
</script>
<style></style>
