import createError from 'axios/lib/core/createError';

export default function errorMessage(axios) {
  axios.interceptors.response.use((response) => {
    if (response.data && response.data.success === false) {
      return Promise.reject(createError(
        response.data.message,
        response.config,
        null,
        response.request,
        response,
      ));
    }
    return response;
  }, (error) => {
    let msg = '';
    if (error && error.response) {
      if (error.response.status === 0) {
        msg = '网络超时请稍后再试';
      }
      if (error.response.status === 404) {
        msg = error.response.data.message || '您访问的接口不存在 !';
      }
      if (error.response.status === 422) {
        return Promise.reject(error);
      }
      msg = msg || error.response.data;
    } else if (error.message) {
      msg = ({ 'Network Error': '网络异常' })[error.message] || error.message;
    } else if (error.code === 'ECONNABORTED') {
      msg = '网络超时请稍后再试';
    }
    if(msg) {
      // 组件(antd/element-ui)弹窗提醒错误
    }
    return Promise.reject(error);
  });
  axios.interceptors.response.use(
    response => response,
    (error) => {
      if (error && error.response && error.response.status === 422) {
        return Promise.reject(error);
      }
      if (!error.isNotified && error.response && error.response.data.success === false) {
        // 组件(element/antd)弹窗提醒
      }
      return Promise.reject(error);
    },
  );
}