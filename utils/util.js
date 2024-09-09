const formatTime = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};
const formatNumber = (n) => {
    n = n.toString();
    return n[1] ? n : `0${n}`;
};
export function formatDateStr(dateStr, short = false) {
    if (!dateStr) {
        return dateStr;
    }
    let dateTimes = dateStr.split(' ');
    let dates = dateTimes[0].split('-');
    if (dates.length == 3) {
        var res = dates[0] + '年' + dates[1] + '月' + dates[2] + '日';
        if (!short && !!dateTimes[1]) {
            res = res + ' ' + dateTimes[1];
        }
        return res;
    } else {
        return dateStr;
    }
}
export function getBaseUrl() {
    //wx.getAccountInfoSync() ， 论坛说直至今天审核版返回的值得develop
    const env = uni.getAccountInfoSync().miniProgram.envVersion;
    if ('release' == env) {
        return 'https://yssl.com.cn'; //生产
    } else {
        return 'https://yssl.com.cn:8189'; //体验
        //return "http://localhost"
    }
}

export function getFullUrl(url) {
    if (!!url) {
        if (url.indexOf('http') == 0) {
            return url;
        } else {
            return getBaseUrl() + url;
        }
    }
    return '';
}
export function showErrorMsg(errorMsg = '网络开小差了') {
    if (errorMsg.length <= 6) {
        uni.showToast({
            title: errorMsg,
            mask: true,
            icon: 'error'
        });
    } else {
        uni.showModal({
            title: '提示',
            content: errorMsg,
            showCancel: false
        });
    }
}

// 过滤表情符号的函数
export function filterEmoji(text) {
    const regex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[^\u0000-\uD7FF\uE000-\uFFFF]/g;
    return text.replace(regex, '');
}
// module.exports = {
//   formatTime
// }
