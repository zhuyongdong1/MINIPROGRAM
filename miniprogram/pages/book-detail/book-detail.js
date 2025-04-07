const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bookId: '', // 图书ID
    bookDetail: null, // 图书详情
    chapters: [], // 章节列表
    recommendations: [], // 推荐图书
    currentTab: 'intro', // 当前选中的Tab：intro-简介，chapters-目录，comments-评论
    loading: true, // 加载状态
    isInBookshelf: false, // 是否已加入书架
    hasUserInfo: false, // 是否已登录
    showAddSuccessTip: false // 显示添加成功提示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options;
    
    if (!id) {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }
    
    this.setData({
      bookId: id,
      hasUserInfo: wx.getStorageSync('userInfo') ? true : false
    });
    
    this.loadBookDetail();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.checkBookInShelf();
  },

  /**
   * 加载图书详情
   */
  async loadBookDetail() {
    try {
      this.setData({ loading: true });
      
      // 模拟请求延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 获取模拟数据
      const bookDetail = this.getMockBookDetail();
      const chapters = this.getMockChapters();
      const recommendations = this.getMockRecommendations();
      
      this.setData({
        bookDetail,
        chapters,
        recommendations,
        loading: false
      });
      
      // 设置页面标题
      wx.setNavigationBarTitle({
        title: bookDetail.title
      });
      
    } catch (error) {
      console.error('加载图书详情失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    }
  },

  /**
   * 切换标签页
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  /**
   * 检查图书是否在书架中
   */
  checkBookInShelf() {
    try {
      // 获取书架数据
      const shelfBooks = wx.getStorageSync('shelfBooks') || [];
      
      // 检查当前图书是否在书架中
      const isInBookshelf = shelfBooks.some(book => book.id === this.data.bookId);
      
      this.setData({ isInBookshelf });
    } catch (error) {
      console.error('检查书架状态失败:', error);
    }
  },

  /**
   * 添加到书架
   */
  addToBookshelf() {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    if (this.data.isInBookshelf) {
      wx.showToast({
        title: '已在书架中',
        icon: 'success'
      });
      return;
    }
    
    try {
      // 获取书架数据
      let shelfBooks = wx.getStorageSync('shelfBooks') || [];
      
      // 添加当前图书
      shelfBooks.push({
        id: this.data.bookId,
        title: this.data.bookDetail.title,
        author: this.data.bookDetail.author,
        coverUrl: this.data.bookDetail.coverUrl,
        updateTime: new Date().toLocaleDateString('zh', { month: 'numeric', day: 'numeric' }),
        isNew: true
      });
      
      // 保存数据
      wx.setStorageSync('shelfBooks', shelfBooks);
      
      // 更新状态
      this.setData({
        isInBookshelf: true,
        showAddSuccessTip: true
      });
      
      // 3秒后隐藏提示
      setTimeout(() => {
        this.setData({ showAddSuccessTip: false });
      }, 3000);
      
    } catch (error) {
      console.error('添加到书架失败:', error);
      wx.showToast({
        title: '添加失败，请重试',
        icon: 'none'
      });
    }
  },

  /**
   * 从书架移除
   */
  removeFromBookshelf() {
    wx.showModal({
      title: '移除提示',
      content: '确定要将本书从书架中移除吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            // 获取书架数据
            let shelfBooks = wx.getStorageSync('shelfBooks') || [];
            
            // 过滤掉当前图书
            shelfBooks = shelfBooks.filter(book => book.id !== this.data.bookId);
            
            // 保存数据
            wx.setStorageSync('shelfBooks', shelfBooks);
            
            // 更新状态
            this.setData({ isInBookshelf: false });
            
            wx.showToast({
              title: '已移除',
              icon: 'success'
            });
            
          } catch (error) {
            console.error('从书架移除失败:', error);
            wx.showToast({
              title: '移除失败，请重试',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  /**
   * 开始阅读
   */
  startReading() {
    wx.navigateTo({
      url: `/pages/reading/reading?id=${this.data.bookId}&chapterId=1`
    });
    
    // 如果不在书架中，自动添加
    if (!this.data.isInBookshelf && this.data.hasUserInfo) {
      this.addToBookshelf();
    }
    
    // 添加到最近阅读
    this.addToRecentReading();
  },

  /**
   * 添加到最近阅读
   */
  addToRecentReading() {
    if (!this.data.hasUserInfo) return;
    
    try {
      // 获取最近阅读数据
      let recentBooks = wx.getStorageSync('recentBooks') || [];
      
      // 移除已存在的相同图书
      recentBooks = recentBooks.filter(book => book.id !== this.data.bookId);
      
      // 添加当前图书到最前面
      recentBooks.unshift({
        id: this.data.bookId,
        title: this.data.bookDetail.title,
        author: this.data.bookDetail.author,
        coverUrl: this.data.bookDetail.coverUrl,
        progress: 0,
        lastReadTime: new Date().toLocaleString('zh', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
      });
      
      // 只保留最近的10本书
      if (recentBooks.length > 10) {
        recentBooks = recentBooks.slice(0, 10);
      }
      
      // 保存数据
      wx.setStorageSync('recentBooks', recentBooks);
      
    } catch (error) {
      console.error('添加到最近阅读失败:', error);
    }
  },

  /**
   * 点击章节
   */
  onTapChapter(e) {
    const { index } = e.currentTarget.dataset;
    const chapterId = this.data.chapters[index].id;
    
    wx.navigateTo({
      url: `/pages/reading/reading?id=${this.data.bookId}&chapterId=${chapterId}`
    });
    
    // 添加到最近阅读
    this.addToRecentReading();
  },

  /**
   * 点击推荐图书
   */
  onTapRecommendation(e) {
    const { bookid } = e.currentTarget.dataset;
    
    wx.navigateTo({
      url: `/pages/book-detail/book-detail?id=${bookid}`
    });
  },

  /**
   * 获取模拟图书详情
   */
  getMockBookDetail() {
    return {
      id: this.data.bookId,
      title: `图书标题${this.data.bookId}`,
      author: '知名作家',
      coverUrl: `https://picsum.photos/200/300?random=${this.data.bookId}`,
      score: 8.9,
      category: '玄幻',
      tags: ['热血', '冒险', '成长'],
      status: '连载中',
      wordCount: '368万字',
      updateTime: '2023-04-08',
      description: '这是一本精彩的小说，主角从一个普通人成长为盖世强者的故事。在这个充满魔法和奇幻的世界里，主角凭借着自己的努力和机缘，一步步走向巅峰，成为了让所有人仰望的存在。故事情节跌宕起伏，人物形象鲜明，世界观宏大，是一部不可多得的精品小说。',
      readerCount: '23.5万',
      commentCount: 1253
    };
  },

  /**
   * 获取模拟章节列表
   */
  getMockChapters() {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `第${i + 1}章 ${i < 10 ? '初入江湖' : '修炼有成'}${i}`,
      updateTime: new Date(Date.now() - i * 86400000).toLocaleDateString('zh', { month: 'numeric', day: 'numeric' }),
      isVip: i > 30
    }));
  },

  /**
   * 获取模拟推荐列表
   */
  getMockRecommendations() {
    return Array.from({ length: 6 }, (_, i) => ({
      id: `rec-${i}`,
      title: `推荐图书${i + 1}`,
      author: `作者${i + 1}`,
      coverUrl: `https://picsum.photos/200/300?random=${100 + i}`,
      score: (8 + i * 0.2).toFixed(1)
    }));
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const { bookDetail } = this.data;
    
    return {
      title: `《${bookDetail.title}》by ${bookDetail.author}`,
      path: `/pages/book-detail/book-detail?id=${this.data.bookId}`,
      imageUrl: bookDetail.coverUrl
    };
  }
}) 