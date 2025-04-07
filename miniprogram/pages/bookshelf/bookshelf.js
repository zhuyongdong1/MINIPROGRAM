const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEditing: false, // 是否处于编辑模式
    booksData: {
      recentBooks: [], // 最近阅读的图书
      shelfBooks: []   // 书架上的图书
    },
    selectedBooks: [], // 选中的图书ID
    loading: false, // 是否正在加载
    hasUserInfo: false, // 是否有用户信息
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
    this.loadBookshelfData();
  },

  /**
   * 检查登录状态
   */
  checkLogin() {
    // 模拟检查登录
    const hasUserInfo = wx.getStorageSync('userInfo') ? true : false;
    this.setData({ hasUserInfo });
    
    return hasUserInfo;
  },

  /**
   * 加载书架数据
   */
  loadBookshelfData() {
    if (!this.checkLogin()) {
      return;
    }
    
    this.setData({ loading: true });
    
    // 模拟请求延迟
    setTimeout(() => {
      // 获取模拟数据
      const booksData = this.getMockBookshelfData();
      
      this.setData({
        booksData,
        loading: false
      });
    }, 500);
  },

  /**
   * 获取模拟书架数据
   */
  getMockBookshelfData() {
    return {
      recentBooks: Array.from({ length: 3 }, (_, i) => ({
        id: `recent-book-${i}`,
        title: `最近阅读书籍${i + 1}`,
        author: `作者${i + 1}`,
        coverUrl: `https://picsum.photos/200/300?random=${i + 100}`,
        progress: Math.floor(Math.random() * 100),
        lastReadTime: new Date(Date.now() - i * 86400000).toLocaleString('zh', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
      })),
      shelfBooks: Array.from({ length: 8 }, (_, i) => ({
        id: `shelf-book-${i}`,
        title: `书架图书${i + 1}`,
        author: `作者${Math.floor(Math.random() * 10) + 1}`,
        coverUrl: `https://picsum.photos/200/300?random=${i + 200}`,
        isNew: i < 2, // 前两本标记为新上架
        updateTime: new Date(Date.now() - i * 86400000).toLocaleDateString('zh', { month: 'numeric', day: 'numeric' })
      }))
    };
  },

  /**
   * 点击图书
   */
  onTapBook(e) {
    const { bookId } = e.currentTarget.dataset;
    
    if (this.data.isEditing) {
      // 编辑模式下，切换选中状态
      this.toggleSelectBook(bookId);
    } else {
      // 普通模式下，跳转到图书阅读页
      wx.navigateTo({
        url: `/pages/book-detail/book-detail?id=${bookId}`
      });
    }
  },

  /**
   * 点击继续阅读
   */
  onTapContinueReading(e) {
    const { bookId } = e.currentTarget.dataset;
    
    // 跳转到阅读页面
    wx.navigateTo({
      url: `/pages/reading/reading?id=${bookId}`
    });
  },

  /**
   * 点击移除最近阅读
   */
  onTapRemoveRecent(e) {
    const { bookId } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '移除提示',
      content: '确定要将此书从最近阅读中移除吗？',
      success: (res) => {
        if (res.confirm) {
          // 移除最近阅读
          const recentBooks = this.data.booksData.recentBooks.filter(book => book.id !== bookId);
          this.setData({
            'booksData.recentBooks': recentBooks
          });
          
          wx.showToast({
            title: '已移除',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 切换编辑模式
   */
  toggleEditMode() {
    const isEditing = !this.data.isEditing;
    
    this.setData({
      isEditing,
      selectedBooks: []
    });
  },

  /**
   * 切换选中图书
   */
  toggleSelectBook(bookId) {
    const selectedBooks = [...this.data.selectedBooks];
    const index = selectedBooks.findIndex(id => id === bookId);
    
    if (index > -1) {
      // 取消选中
      selectedBooks.splice(index, 1);
    } else {
      // 选中
      selectedBooks.push(bookId);
    }
    
    // 创建新数组并更新，确保视图更新
    this.setData({ 
      selectedBooks: selectedBooks 
    });
  },

  /**
   * 全选/取消全选
   */
  toggleSelectAll() {
    const { selectedBooks, booksData } = this.data;
    const allBookIds = booksData.shelfBooks.map(book => book.id);
    
    if (selectedBooks.length === allBookIds.length) {
      // 全部取消
      this.setData({ selectedBooks: [] });
    } else {
      // 全选
      this.setData({ selectedBooks: [...allBookIds] });
    }
  },

  /**
   * 删除选中图书
   */
  deleteSelectedBooks() {
    const { selectedBooks, booksData } = this.data;
    
    if (selectedBooks.length === 0) {
      wx.showToast({
        title: '请先选择图书',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: '删除提示',
      content: `确定要删除选中的${selectedBooks.length}本图书吗？`,
      success: (res) => {
        if (res.confirm) {
          // 删除选中的图书
          const shelfBooks = booksData.shelfBooks.filter(book => !selectedBooks.includes(book.id));
          
          this.setData({
            'booksData.shelfBooks': shelfBooks,
            selectedBooks: [],
            isEditing: false
          });
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 取消编辑
   */
  cancelEdit() {
    this.setData({
      isEditing: false,
      selectedBooks: []
    });
  },

  /**
   * 登录
   */
  onTapLogin() {
    // 模拟登录
    wx.showLoading({
      title: '登录中...',
    });
    
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟存储用户信息
      wx.setStorageSync('userInfo', {
        id: 'user-001',
        name: '测试用户',
        avatarUrl: 'https://picsum.photos/200/200?random=1'
      });
      
      this.setData({ hasUserInfo: true });
      this.loadBookshelfData();
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
    }, 1000);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadBookshelfData();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '我的书架',
      path: '/pages/bookshelf/bookshelf'
    };
  }
}) 