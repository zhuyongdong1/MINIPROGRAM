const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    rankTypes: [], // 排行榜类型列表
    activeRankIndex: 0, // 当前选中的排行榜索引
    books: [], // 当前排行榜的图书列表
    page: 1, // 当前页码
    pageSize: 10, // 每页数量
    hasMore: true, // 是否有更多数据
    loading: false, // 是否正在加载
    firstLoad: true, // 是否首次加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "排行榜"
    });
    
    this.initData();
  },

  /**
   * 初始化数据
   */
  async initData() {
    try {
      this.setData({ loading: true });
      
      // 获取排行榜类型
      const rankTypes = this.getMockRankTypes();
      
      this.setData({
        rankTypes,
        activeRankIndex: 0
      });
      
      // 加载当前排行榜数据
      await this.loadRankingBooks();
      
    } catch (error) {
      console.error('初始化数据失败:', error);
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ 
        loading: false,
        firstLoad: false
      });
      
      // 停止下拉刷新
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 加载排行榜图书
   */
  async loadRankingBooks() {
    if (this.data.loading || (!this.data.hasMore && !this.data.firstLoad)) {
      return;
    }
    
    try {
      this.setData({ loading: true });
      
      const { activeRankIndex, rankTypes, page, pageSize, books } = this.data;
      const currentRankType = rankTypes[activeRankIndex];
      
      // 模拟请求延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 获取排行榜图书
      const newBooks = this.getMockRankingBooks(currentRankType.id, page, pageSize);
      
      // 判断是否有更多数据
      const hasMore = newBooks.length === pageSize;
      
      this.setData({
        books: page === 1 ? newBooks : [...books, ...newBooks],
        hasMore,
        page: hasMore ? page + 1 : page
      });
      
    } catch (error) {
      console.error('加载排行榜图书失败:', error);
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
      
      // 停止下拉刷新
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 获取模拟排行榜类型
   */
  getMockRankTypes() {
    return [
      { id: 'hot', name: '热门榜' },
      { id: 'new', name: '新书榜' },
      { id: 'vote', name: '推荐榜' },
      { id: 'finish', name: '完结榜' },
      { id: 'month', name: '月榜' },
      { id: 'classic', name: '经典榜' }
    ];
  },

  /**
   * 获取模拟排行榜图书
   */
  getMockRankingBooks(rankId, page, pageSize) {
    const genres = ['都市', '玄幻', '科幻', '历史', '军事', '游戏', '推理'];
    const startIndex = (page - 1) * pageSize;
    
    // 如果是第3页以上，模拟没有更多数据
    if (page > 2) {
      return [];
    }
    
    return Array.from({ length: pageSize }, (_, i) => {
      const index = startIndex + i;
      const rankNum = startIndex + i + 1; // 排名从1开始
      
      return {
        id: `book-${rankId}-${index}`,
        title: `${rankId === 'hot' ? '热门' : rankId === 'new' ? '新书' : '推荐'}小说${rankNum}`,
        author: `作者${index % 10 + 1}`,
        coverUrl: `https://picsum.photos/200/300?random=${index}`,
        description: `这是排行榜第${rankNum}名的小说，类型是${genres[index % genres.length]}`,
        genre: genres[index % genres.length],
        score: (9.0 - (index * 0.1)).toFixed(1),
        rankNum: rankNum // 排名
      };
    });
  },

  /**
   * 切换排行榜类型
   */
  onTabChange(e) {
    const index = e.currentTarget.dataset.index;
    
    if (index === this.data.activeRankIndex) {
      return;
    }
    
    this.setData({
      activeRankIndex: index,
      books: [],
      page: 1,
      hasMore: true,
      firstLoad: true
    }, () => {
      this.loadRankingBooks();
    });
  },

  /**
   * 点击图书项
   */
  onTapBook(e) {
    const { bookId } = e.detail;
    
    // 跳转到图书详情页
    wx.navigateTo({
      url: `/pages/book-detail/book-detail?id=${bookId}`
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      books: [],
      page: 1,
      hasMore: true
    }, () => {
      this.loadRankingBooks();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore && !this.data.loading) {
      this.loadRankingBooks();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const { activeRankIndex, rankTypes } = this.data;
    const currentRank = rankTypes[activeRankIndex];
    
    return {
      title: `${currentRank.name} - 小说排行榜`,
      path: `/pages/ranking/ranking?rankId=${currentRank.id}`
    };
  }
}) 