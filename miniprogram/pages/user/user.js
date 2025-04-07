const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false,
    statistics: {
      readCount: 0,
      readDays: 0,
      bookmarkCount: 0,
      noteCount: 0
    },
    menuList: [
      {
        id: 'favorite',
        name: '我的收藏',
        icon: 'star',
        url: '/pages/favorite/favorite'
      },
      {
        id: 'history',
        name: '阅读历史',
        icon: 'history',
        url: '/pages/history/history'
      },
      {
        id: 'notes',
        name: '我的笔记',
        icon: 'note',
        url: '/pages/notes/notes'
      },
      {
        id: 'feedback',
        name: '意见反馈',
        icon: 'feedback',
        url: '/pages/feedback/feedback'
      }
    ],
    settingList: [
      {
        id: 'theme',
        name: '主题设置',
        icon: 'theme',
        url: '/pages/theme/theme'
      },
      {
        id: 'fontsize',
        name: '字体大小',
        icon: 'font',
        url: '/pages/font-setting/font-setting'
      },
      {
        id: 'cache',
        name: '清除缓存',
        icon: 'clear',
        handler: 'clearCache'
      },
      {
        id: 'about',
        name: '关于我们',
        icon: 'about',
        url: '/pages/about/about'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkLogin();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.hasUserInfo) {
      this.loadUserStatistics();
    }
  },

  /**
   * 检查登录状态
   */
  checkLogin() {
    // 获取本地存储的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    
    if (userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      });
      
      this.loadUserStatistics();
    }
  },

  /**
   * 加载用户统计数据
   */
  loadUserStatistics() {
    // 模拟获取统计数据
    setTimeout(() => {
      this.setData({
        statistics: {
          readCount: Math.floor(Math.random() * 100),
          readDays: Math.floor(Math.random() * 30),
          bookmarkCount: Math.floor(Math.random() * 50),
          noteCount: Math.floor(Math.random() * 20)
        }
      });
    }, 500);
  },

  /**
   * 登录处理
   */
  onTapLogin() {
    // 模拟登录
    wx.showLoading({
      title: '登录中...',
    });
    
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟存储用户信息
      const userInfo = {
        nickName: '读书用户',
        avatarUrl: '/images/default_avatar.png'
      };
      
      wx.setStorageSync('userInfo', userInfo);
      
      this.setData({
        userInfo,
        hasUserInfo: true
      });
      
      this.loadUserStatistics();
    }, 1000);
  },

  /**
   * 退出登录
   */
  onTapLogout() {
    wx.showModal({
      title: '退出提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除用户信息
          wx.removeStorageSync('userInfo');
          
          this.setData({
            userInfo: null,
            hasUserInfo: false,
            statistics: {
              readCount: 0,
              readDays: 0,
              bookmarkCount: 0,
              noteCount: 0
            }
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 点击菜单项
   */
  onTapMenuItem(e) {
    const { id, url, handler } = e.currentTarget.dataset.item;
    
    // 如果未登录且不是关于我们或清除缓存，则提示登录
    if (!this.data.hasUserInfo && id !== 'about' && id !== 'cache') {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    if (handler) {
      // 调用对应的处理函数
      this[handler]();
    } else if (url) {
      // 跳转到对应页面
      wx.navigateTo({ url });
    }
  },

  /**
   * 清除缓存
   */
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除本地缓存吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除非用户相关的缓存
          try {
            // 保留用户信息
            const userInfo = wx.getStorageSync('userInfo');
            
            // 清除所有缓存
            wx.clearStorageSync();
            
            // 恢复用户信息
            if (userInfo) {
              wx.setStorageSync('userInfo', userInfo);
            }
            
            wx.showToast({
              title: '缓存已清除',
              icon: 'success'
            });
          } catch (e) {
            console.error('清除缓存失败：', e);
            wx.showToast({
              title: '清除失败，请重试',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '小说阅读器 - 个人中心',
      path: '/pages/user/user'
    };
  }
}) 