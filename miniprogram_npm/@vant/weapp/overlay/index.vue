<template>
    <view>
        <root-portal v-if="rootPortal">
            <Overlay :data="this"></Overlay>
        </root-portal>

        <Overlay v-else :data="this"></Overlay>
    </view>
</template>

<script>
'use strict';
import Overlay from './overlay.vue';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
export default {
    components: {
        Overlay
    },
    data() {
        return {
            this: []
        };
    },
    props: {
        show: Boolean,
        customStyle: String,
        duration: {
            type: null,
            default: 300
        },
        zIndex: {
            type: Number,
            default: 1
        },
        lockScroll: {
            type: Boolean,
            default: true
        },
        rootPortal: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onClick: function () {
            this.$emit('click');
        },
        // for prevent touchmove
        noop: function () {}
    }
};
</script>
<style>
@import '../common/index.css';
.van-overlay {
    background-color: var(--overlay-background-color, rgba(0, 0, 0, 0.7));
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
}
</style>
