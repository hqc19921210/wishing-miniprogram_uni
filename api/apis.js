import { request } from '../utils/request.js';
export function getArticleList(data) {
    return request({
        url: '/api/mini/article/getReleasedMediumList',
        data: data
    });
}
export function getReleasedArticleById(data) {
    return request({
        url: '/api/mini/article/getReleasedMediumById',
        data: data
    });
}
export function getVideoList(data) {
    return request({
        url: '/api/mini/video/getReleasedMediumList',
        data: data
    });
}
export function getReleasedVideoById(data) {
    return request({
        url: '/api/mini/video/getReleasedMediumById',
        data: data
    });
}
export function getPoolVideoById(data) {
    return request({
        url: '/api/mini/video/getPoolVideoById',
        data: data
    });
}
export function collectInsert(data) {
    return request({
        url: '/api/mini/collect/insert',
        data: data
    });
}
export function collectDelete(data) {
    return request({
        url: '/api/mini/collect/delete',
        data: data
    });
}
export function getUserInfoById(data) {
    return request({
        url: '/api/mini/mine/getUserInfoById',
        data: data
    });
}
export function updateUserInfoById(data) {
    return request({
        url: '/api/mini/mine/updateUserInfoById',
        data: data
    });
}
export function prayerForm(data) {
    return request({
        url: '/api/mini/prayer/prayerForm',
        data: data
    });
}
export function prayerChooseInfo(data) {
    return request({
        url: '/api/mini/prayer/prayerChooseInfo',
        data: data
    });
}
export function savePrayerForm(data) {
    return request({
        url: '/api/mini/prayer/save',
        data: data
    });
}
export function preOrder(data) {
    return request({
        url: '/api/mini/pay/preOrder',
        data: data
    });
}
export function getUnread(data) {
    return request({
        url: '/api/mini/mine/getUnread',
        data: data
    });
}
export function getUserSysMsg(data) {
    return request({
        url: '/api/mini/message/getUserSysMsg',
        data: data
    });
}
export function userReadMsg(data) {
    return request({
        url: '/api/mini/message/userReadMsg',
        data: data
    });
}
export function requestPayment(data) {
    return request({
        url: '/api/mini/prayer/requestPayment',
        data: data
    });
}
export function getCollectMediumList(data) {
    return request({
        url: '/api/mini/collect/getCollectMediumList',
        data: data
    });
}
export function payWithScore(data) {
    return request({
        url: '/api/mini/pay/payWithScore',
        data: data
    });
}
export function getPrayerByNo(data) {
    return request({
        url: '/api/mini/prayer/getByNo',
        data: data
    });
}
export function toRedeem(data) {
    return request({
        url: '/api/mini/prayer/toRedeem',
        data: data
    });
}
export function payRedeem(data) {
    return request({
        url: '/api/mini/pay/payRedeem',
        data: data
    });
}
export function getMyPrayerList(data) {
    return request({
        url: '/api/mini/prayer/getMyPrayerList',
        data: data
    });
}
export function saveMemo(data) {
    return request({
        url: '/api/mini/prayer/saveMemo',
        data: data
    });
}
export function saveUserMessage(data) {
    return request({
        url: '/api/mini/message/saveUserMessage',
        data: data
    });
}
export function getPrayerPool(data) {
    return request({
        url: '/api/mini/prayer/getPrayerPool',
        data: data
    });
}
export function getMediumPool(data) {
    return request({
        url: '/api/mini/prayer/getMediumPool',
        data: data
    });
}
export function getUserScore(data) {
    return request({
        url: '/api/mini/mine/getUserScore',
        data: data
    });
}
export function saveScore(data) {
    return request({
        url: '/api/mini/mine/saveScore',
        data: data
    });
}
export function getTopPrayer(data) {
    return request({
        url: '/api/mini/prayer/getTopPrayer',
        data: data
    });
}
