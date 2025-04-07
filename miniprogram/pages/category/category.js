const categoryApi = require('../../utils/api/category');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 页面标题
    pageTitle: '分类',
    // 分类ID
    categoryId: 0,
    // 分类名称
    categoryName: '',
    // 特殊分类类型
    specialType: '',
    // 主筛选项
    filters: [],
    // 子筛选项
    subFilters: [],
    // 当前选中的主筛选索引
    activeFilterIndex: 0,
    // 当前选中的子筛选索引
    activeSubFilterIndex: 0,
    // 书籍列表
    books: [],
    // 页码
    page: 1,
    // 每页数量
    pageSize: 10,
    // 是否有更多数据
    hasMore: true,
    // 是否加载中
    loading: false,
    // 是否初次加载
    firstLoad: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置初始数据
    const { id, name, type } = options;
    
    if (id && name) {
      // 如果是具体分类
      this.setData({
        categoryId: parseInt(id),
        categoryName: name,
        pageTitle: name
      });
    } else if (type) {
      // 如果是特殊分类
      let title = '分类';
      switch (type) {
        case 'recommend':
          title = '推荐小说';
          break;
        case 'hot':
          title = '热门排行';
          break;
        case 'new':
          title = '新书上架';
          break;
      }
      
      this.setData({
        specialType: type,
        pageTitle: title
      });
    }
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: this.data.pageTitle
    });
    
    // 初始化数据
    this.initData();
  },

  /**
   * 初始化数据
   */
  async initData() {
    try {
      this.setData({ loading: true });
      
      // 获取筛选项数据
      await this.loadFilters();
      
      // 加载书籍数据
      await this.loadBooks(true);
      
      this.setData({
        firstLoad: false,
        loading: false
      });
    } catch (error) {
      console.error('初始化分类页面失败:', error);
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
      
      this.setData({
        firstLoad: false,
        loading: false
      });
    }
  },

  /**
   * 加载筛选项数据
   */
  async loadFilters() {
    try {
      // 实际项目中应该调用 API 获取数据
      // const res = await categoryApi.getCategoryFilters();
      // const filterData = res.data;
      
      // 模拟筛选项数据
      const filterData = this.getMockFilters();
      
      this.setData({
        filters: filterData.filters,
        subFilters: filterData.subFilters
      });
    } catch (error) {
      console.error('获取筛选项失败:', error);
      this.setData({
        filters: this.getMockFilters().filters,
        subFilters: this.getMockFilters().subFilters
      });
    }
  },

  /**
   * 加载书籍数据
   * @param {boolean} refresh - 是否刷新
   */
  async loadBooks(refresh = false) {
    try {
      if (this.data.loading || (!refresh && !this.data.hasMore)) {
        return;
      }
      
      const page = refresh ? 1 : this.data.page;
      
      this.setData({
        loading: true
      });
      
      // 根据不同类型加载数据
      let newBooks = [];
      
      if (this.data.specialType) {
        // 加载特殊分类数据
        // 实际项目中应该调用 API 获取数据
        // const res = await categoryApi.getSpecialCategoryBooks(this.data.specialType, page, this.data.pageSize);
        // newBooks = res.data.list;
        // 模拟数据
        newBooks = this.getMockBooks();
      } else {
        // 加载普通分类数据
        const { categoryId, activeFilterIndex, activeSubFilterIndex, filters, subFilters } = this.data;
        
        const params = {
          categoryId,
          filter: filters[activeFilterIndex]?.id || 'all',
          order: subFilters[activeSubFilterIndex]?.id || 'hot',
          page,
          size: this.data.pageSize
        };
        
        // 实际项目中应该调用 API 获取数据
        // const res = await categoryApi.getCategoryBooks(params);
        // newBooks = res.data.list;
        // 模拟数据
        newBooks = this.getMockBooks();
      }
      
      this.setData({
        books: refresh ? newBooks : [...this.data.books, ...newBooks],
        page: page + 1,
        hasMore: newBooks.length === this.data.pageSize,
        loading: false
      });
    } catch (error) {
      console.error('加载书籍数据失败:', error);
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
      
      this.setData({
        loading: false
      });
    }
  },

  /**
   * 点击主筛选项
   */
  onFilterChange(e) {
    const index = e.currentTarget.dataset.index;
    
    if (index === this.data.activeFilterIndex) {
      return;
    }
    
    this.setData({
      activeFilterIndex: index,
      activeSubFilterIndex: 0, // 重置子筛选项
      books: [],
      page: 1,
      hasMore: true
    });
    
    this.loadBooks(true);
  },

  /**
   * 点击子筛选项
   */
  onSubFilterChange(e) {
    const index = e.currentTarget.dataset.index;
    
    if (index === this.data.activeSubFilterIndex) {
      return;
    }
    
    this.setData({
      activeSubFilterIndex: index,
      books: [],
      page: 1,
      hasMore: true
    });
    
    this.loadBooks(true);
  },

  /**
   * 点击书籍
   */
  onTapBook(e) {
    const { book } = e.detail;
    wx.navigateTo({
      url: `/pages/book-detail/book-detail?id=${book.id}`
    });
  },

  /**
   * 模拟筛选项数据
   */
  getMockFilters() {
    return {
      filters: [
        { id: 'all', name: '全部' },
        { id: 'modern', name: '现代都市' },
        { id: 'ancient', name: '古代架空' },
        { id: 'fantasy', name: '玄幻奇幻' },
        { id: 'scifi', name: '科幻未来' },
        { id: 'suspense', name: '悬疑推理' },
        { id: 'campus', name: '校园青春' }
      ],
      subFilters: [
        { id: 'hot', name: '人气' },
        { id: 'rating', name: '评分' },
        { id: 'collect', name: '收藏' },
        { id: 'new', name: '新书' },
        { id: 'complete', name: '完结' },
        { id: 'serial', name: '连载' }
      ]
    };
  },

  /**
   * 模拟书籍数据
   */
  getMockBooks() {
    return [
      {
        id: 1,
        title: '校园奇缘',
        author: '沈月光',
        coverUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['校园', '完结']
      },
      {
        id: 2,
        title: '都市迷情',
        author: '张时雨',
        coverUrl: 'https://images.unsplash.com/photo-1503830232156-181a48490465?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['都市', '热门']
      },
      {
        id: 3,
        title: '古代密探',
        author: '李云天',
        coverUrl: 'https://images.unsplash.com/photo-1529473814998-077b4fec6770?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['古代', '悬疑']
      },
      {
        id: 4,
        title: '星际迷航',
        author: '黄河清',
        coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['科幻', '连载']
      },
      {
        id: 5,
        title: '异世界冒险',
        author: '赵明志',
        coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['奇幻', '冒险']
      },
      {
        id: 6,
        title: '心灵密码',
        author: '陈慕容',
        coverUrl: 'https://images.unsplash.com/photo-1531301677377-f5549c6e5227?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tags: ['悬疑', '推理']
      }
    ];
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadBooks(true).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore && !this.data.loading) {
      this.loadBooks();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.pageTitle,
      path: this.data.specialType
        ? `/pages/category/category?type=${this.data.specialType}`
        : `/pages/category/category?id=${this.data.categoryId}&name=${this.data.categoryName}`
    };
  }
}) 