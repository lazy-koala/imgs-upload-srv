    import { Message } from 'element-ui';

function formatTime (time) {
    time = new Date(parseInt(time, 10));
    return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + (time.getHours() < 10 ? "0" + time.getHours() : time.getHours()) + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()) + ":" + (time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds());
}

function trimString (value) {
    return (value || '').replace(/\s/g, '');
}
function catchError(error) {
    let response = error.response || {};
    let message = response.data && response.data.message || '';
   if (response && response.status && response.status == '401') {
        // 登录态失效
        Cookies.set('uinfo', '');
        this.$router.push('/');
   } else if (response && response.status && response.status == '400') {
        // 参数错误
        Message.error({
            message: message ? message : '参数有误，请重试',
            center: true
        });
   } else if (response && response.status && response.status == '502') {
        Message.error({
            message: '网络异常，请重试',
            center: true
        });
   } else {
       Message.error({
           message: '网络异常，请重试',
           center: true
       });
   }
 }
export default {
  formatTime,
  trimString,
  catchError
};