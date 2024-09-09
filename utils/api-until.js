import { request } from './request.js';
const version = uni.getAppBaseInfo().SDKVersion;
export function getsetOpenid() {
    return new Promise((resolve, reject) => {
        //异步获取缓存并存储Storage,同步方法社区8月份有反馈部分机型无法获取或获取到值为空
        uni.getStorage({
            key: 'openid',
            success(res) {
                // console.log("我拿到了openid："+res.data)
                //   return res.data;
                resolve(res.data);
            },
            fail() {
                uni.login({
                    success(res) {
                        if (res.code) {
                            //发起网络请求
                            request({
                                url: '/api/mini/loginWxUser',
                                data: {
                                    code: res.code
                                }
                            }).then((data) => {
                                // console.log(data);
                                let rs = data[0];
                                if (!!rs.openid) {
                                    uni.setStorage({
                                        key: 'openid',
                                        data: rs.openid
                                    });
                                    // return rs.openid;
                                    resolve(rs.openid);
                                }
                            });
                        } else {
                            uni.showToast({
                                title: '获取用户登录失败',
                                mask: true,
                                icon: 'error'
                            });
                            reject('接口调用失败');
                        }
                    }
                });
            }
        });
    });
}
// export async function getOpenidSync() {
// 	let openid = wx.getStorageSync('openid')
// 	if (!openid) {
// 		openid = await getsetOpenid();
// 	}
// 	return openid
// }

// 大于1，小于-1，等于0
export function compareVersion(v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    const len = Math.max(v1.length, v2.length);
    while (v1.length < len) {
        v1.push('0');
    }
    while (v2.length < len) {
        v2.push('0');
    }
    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i]);
        const num2 = parseInt(v2[i]);
        if (num1 > num2) {
            return 1;
        } else if (num1 < num2) {
            return -1;
        }
    }
    return 0;
}
//返回当前小程序版本是否大于2.21.4,true能使用wx.getUserInfo
export function canUseGetUserInfo() {
    if (compareVersion(version, '2.21.4') >= 0) {
        return true;
    } else {
        return false;
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        // wx.showModal({
        //   title: '提示',
        //   content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        // })
    }
}
