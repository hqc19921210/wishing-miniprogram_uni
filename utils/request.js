import { showErrorMsg, getFullUrl } from './util.js';
const app = getApp();
export function request(params) {
    let dataObj = params.data || {};
    let headerObj = params.header || {
        'content-type': 'application/json'
    };
    return new Promise((resolve, reject) => {
        uni.request({
            url: getFullUrl(params.url),
            method: params.method || 'POST',
            data: dataObj,
            header: headerObj,
            success: (res) => {
                console.info(res);
                if (res.statusCode == 200) {
                    if (res.data.success) {
                        resolve(res.data.data);
                    } else if (res.data.status == 400) {
                        reject(res.data.errorMsg);
                    } else {
                        showErrorMsg(); //500
                    }
                } else {
                    console.log('non 200');
                    showErrorMsg(res.data.error);
                    //reject(res.data);
                }
            },

            fail: (err) => {
                console.info('fail');
                showErrorMsg();
                reject(err);
            }
        });
    });
}
