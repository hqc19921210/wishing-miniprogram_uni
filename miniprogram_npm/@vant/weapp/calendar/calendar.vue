<template>
    <view class="van-calendar">
        <header :title="title" :showTitle="showTitle" :subtitle="subtitle" :showSubtitle="showSubtitle" :firstDayOfWeek="firstDayOfWeek" @click-subtitle="onClickSubtitle">
            <slot name="title" slot="title"></slot>
        </header>

        <scroll-view class="van-calendar__body" scroll-y :scroll-into-view="scrollIntoView">
            <month
                :id="'month' + index"
                class="month"
                :data-date="item"
                :date="item"
                :type="type"
                :color="color"
                :minDate="minDate"
                :maxDate="maxDate"
                :showMark="showMark"
                :formatter="formatter"
                :rowHeight="rowHeight"
                :currentDate="currentDate"
                :showSubtitle="showSubtitle"
                :allowSameDay="allowSameDay"
                :showMonthTitle="index !== 0 || !showSubtitle"
                :firstDayOfWeek="firstDayOfWeek"
                @click="onClickDay"
                v-for="(item, index) in computed.getMonths(minDate, maxDate)"
                :key="index"
            ></month>
        </scroll-view>

        <view :class="utils.bem('calendar__footer', { safeAreaInsetBottom })">
            <slot name="footer"></slot>
        </view>

        <view :class="utils.bem('calendar__footer', { safeAreaInsetBottom })">
            <van-button
                v-if="showConfirm"
                round
                block
                type="danger"
                :color="color"
                custom-class="van-calendar__confirm"
                :disabled="computed.getButtonDisabled(type, currentDate, minRange)"
                nativeType="text"
                @click="onConfirm"
            >
                {{ computed.getButtonDisabled(type, currentDate, minRange) ? confirmDisabledText : confirmText }}
            </van-button>
        </view>
    </view>
</template>

<script>
export default {
    props: ['data', 'compName'],
    computed: {
        title() {
            return this.data.title;
        },
        showTitle() {
            return this.data.showTitle;
        },
        subtitle() {
            return this.data.subtitle;
        },
        showSubtitle() {
            return this.data.showSubtitle;
        },
        firstDayOfWeek() {
            return this.data.firstDayOfWeek;
        },
        scrollIntoView() {
            return this.data.scrollIntoView;
        },
        index() {
            return this.data.index;
        },
        item() {
            return this.data.item;
        },
        type() {
            return this.data.type;
        },
        color() {
            return this.data.color;
        },
        minDate() {
            return this.data.minDate;
        },
        maxDate() {
            return this.data.maxDate;
        },
        showMark() {
            return this.data.showMark;
        },
        formatter() {
            return this.data.formatter;
        },
        rowHeight() {
            return this.data.rowHeight;
        },
        currentDate() {
            return this.data.currentDate;
        },
        allowSameDay() {
            return this.data.allowSameDay;
        },
        showConfirm() {
            return this.data.showConfirm;
        },
        onClickSubtitle() {
            return this.data.onClickSubtitle;
        },
        onClickDay() {
            return this.data.onClickDay;
        },
        onConfirm() {
            return this.data.onConfirm;
        }
    }
};
</script>
<style></style>
