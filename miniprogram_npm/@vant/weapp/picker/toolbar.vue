<template>
    <view v-if="showToolbar" class="van-picker__toolbar toolbar-class">
        <view class="van-picker__cancel" hover-class="van-picker__cancel--hover" hover-stay-time="70" data-type="cancel" @tap="emit">
            {{ cancelButtonText }}
        </view>
        <view v-if="title" class="van-picker__title van-ellipsis">{{ title }}</view>
        <view class="van-picker__confirm" hover-class="van-picker__confirm--hover" hover-stay-time="70" data-type="confirm" @tap="emit">
            {{ confirmButtonText }}
        </view>
    </view>
</template>

<script>
export default {
    props: ['data', 'compName'],
    computed: {
        showToolbar() {
            return this.data.showToolbar;
        },
        cancelButtonText() {
            return this.data.cancelButtonText;
        },
        title() {
            return this.data.title;
        },
        confirmButtonText() {
            return this.data.confirmButtonText;
        },
        emit() {
            return this.data.emit;
        }
    }
};
</script>
<style></style>
