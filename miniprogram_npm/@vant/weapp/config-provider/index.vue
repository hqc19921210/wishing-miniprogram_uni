<template>
    <view class="van-config-provider" :style="computed.mapThemeVarsToCSSVars(themeVars)">
        <slot />
    </view>
</template>
<script module="computed" lang="wxs" src="@/miniprogram_npm/@vant/weapp/config-provider/index.wxs"></script>
<script>
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var component_1 = require('../common/component');
export default {
    data() {
        return {};
    },
    props: {
        themeVars: {
            type: Object,
            default: () => ({})
        }
    }
};
</script>
<style></style>
