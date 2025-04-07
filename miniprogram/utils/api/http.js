/**
 * HTTP请求封装
 */

// 基础URL，实际开发中应该根据环境配置
const BASE_URL = 'http://152.136.131.180:3000';

// 默认超时时间
const TIMEOUT = 10000;

/**
 * 微信请求封装
 * @param {Object} options - 请求配置
 * @param {string} options.url - 请求地址
 * @param {string} options.method - 请求方法
 * @param {Object} options.data - 请求数据
 * @param {boolean} options.showLoading - 是否显示loading
 * @param {number} options.timeout - 超时时间
 * @returns {Promise} - 返回Promise
 */
const request = (options) => {
  const { url, method = 'GET', data = {}, showLoading = true, timeout = TIMEOUT } = options;

  // 显示加载中
  if (showLoading) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
  }

  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    
    wx.request({
      url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
      method,
      data,
      timeout,
      header: {
        'content-type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        // 如果状态码为200，返回数据
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          // 处理错误状态码
          handleError(res.statusCode, res.data);
          reject(res);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon: 'none',
          duration: 2000
        });
        reject(err);
      },
      complete: () => {
        if (showLoading) {
          wx.hideLoading();
        }
      }
    });
  });
};

/**
 * 处理错误状态码
 * @param {number} statusCode - 状态码
 * @param {Object} data - 响应数据
 */
const handleError = (statusCode, data) => {
  let errorMsg = '';
  
  switch(statusCode) {
    case 400:
      errorMsg = data.message || '请求参数错误';
      break;
    case 401:
      errorMsg = '未授权，请重新登录';
      // 可以在这里处理登录过期逻辑
      break;
    case 403:
      errorMsg = '拒绝访问';
      break;
    case 404:
      errorMsg = '请求地址出错';
      break;
    case 500:
      errorMsg = '服务器内部错误';
      break;
    default:
      errorMsg = '网络异常，请稍后重试';
  }
  
  wx.showToast({
    title: errorMsg,
    icon: 'none',
    duration: 2000
  });
};

// 导出请求方法
module.exports = {
  // GET请求
  get: (url, data = {}, showLoading = true) => {
    return request({
      url,
      method: 'GET',
      data,
      showLoading
    });
  },
  
  // POST请求
  post: (url, data = {}, showLoading = true) => {
    return request({
      url,
      method: 'POST',
      data,
      showLoading
    });
  },
  
  // PUT请求
  put: (url, data = {}, showLoading = true) => {
    return request({
      url,
      method: 'PUT',
      data,
      showLoading
    });
  },
  
  // DELETE请求
  delete: (url, data = {}, showLoading = true) => {
    return request({
      url,
      method: 'DELETE',
      data,
      showLoading
    });
  }
}; 