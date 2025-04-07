const homeApi = require('../../utils/api/home');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    banners: [],
    // 推荐小说数据
    recommendBooks: [],
    // 分类数据
    categories: [],
    // 热门排行榜数据
    hotRanking: [],
    // 新书上架数据
    newBooks: [],
    // 页面加载状态
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadData();
  },

  /**
   * 加载页面数据
   */
  async loadData() {
    try {
      // 显示加载中
      wx.showLoading({
        title: '加载中...'
      });

      // 并行请求数据
      const [banners, recommendBooks, categories, hotRanking, newBooks] = await Promise.all([
        this.getBanners(),
        this.getRecommendBooks(),
        this.getCategories(),
        this.getHotRanking(),
        this.getNewBooks()
      ]);

      this.setData({
        banners,
        recommendBooks,
        categories,
        hotRanking,
        newBooks,
        loading: false
      });

      // 隐藏加载提示
      wx.hideLoading();
    } catch (error) {
      console.error('加载首页数据失败:', error);
      wx.hideLoading();
      
      wx.showToast({
        title: '加载数据失败，请重试',
        icon: 'none'
      });

      this.setData({
        loading: false
      });
    }
  },

  /**
   * 获取轮播图数据
   */
  async getBanners() {
    try {
      // 实际项目中应该调用 API 获取数据
      // const res = await homeApi.getBanners();
      // return res.data;

      // 模拟数据
      return [
        {
          id: 1,
          imageUrl: 'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          title: '新书推荐',
          link: '/pages/detail/detail?id=1'
        },
        {
          id: 2,
          imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          title: '热门小说',
          link: '/pages/detail/detail?id=2'
        },
        {
          id: 3,
          imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          title: '经典作品',
          link: '/pages/detail/detail?id=3'
        }
      ];
    } catch (error) {
      console.error('获取轮播图失败:', error);
      return [];
    }
  },

  /**
   * 获取推荐小说数据
   */
  async getRecommendBooks() {
    try {
      // 实际项目中应该调用 API 获取数据
      // const res = await homeApi.getRecommendBooks();
      // return res.data;

      // 模拟数据
      return [
        {
          id: 1,
          title: '星辰大海',
          author: '林若晨',
          coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 2,
          title: '青春如歌',
          author: '夏日长',
          coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 3,
          title: '命运交织',
          author: '何以笙',
          coverUrl: 'https://images.unsplash.com/photo-1531072901881-d644216d4bf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 4,
          title: '心的旅程',
          author: '李明轩',
          coverUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        }
      ];
    } catch (error) {
      console.error('获取推荐小说失败:', error);
      return [];
    }
  },

  /**
   * 获取分类数据
   */
  async getCategories() {
    try {
      // 实际项目中应该调用 API 获取数据
      // const res = await homeApi.getCategories();
      // return res.data;

      // 模拟数据
      return [
        {
          id: 1,
          name: '现代都市',
          icon: '📚',
          bgColor: 'linear-gradient(135deg, #6e80e1, #4e64e7)'
        },
        {
          id: 2,
          name: '古代架空',
          icon: '🏰',
          bgColor: 'linear-gradient(135deg, #f6b851, #f5994e)'
        },
        {
          id: 3,
          name: '玄幻奇幻',
          icon: '🔮',
          bgColor: 'linear-gradient(135deg, #9f7ae7, #7058e6)'
        },
        {
          id: 4,
          name: '科幻未来',
          icon: '🚀',
          bgColor: 'linear-gradient(135deg, #5ccfe6, #41bbe5)'
        }
      ];
    } catch (error) {
      console.error('获取分类数据失败:', error);
      return [];
    }
  },

  /**
   * 获取热门排行榜数据
   */
  async getHotRanking() {
    try {
      // 实际项目中应该调用 API 获取数据
      // const res = await homeApi.getHotRanking();
      // return res.data;

      // 模拟数据
      return [
        {
          id: 1,
          title: '破晓之光',
          readCount: '12.5万',
          rating: '4.9',
          category: '都市',
          status: '完结'
        },
        {
          id: 2,
          title: '逆光之恋',
          readCount: '10.2万',
          rating: '4.8',
          category: '现代',
          status: '连载'
        },
        {
          id: 3,
          title: '星河涟漪',
          readCount: '9.8万',
          rating: '4.7',
          category: '科幻',
          status: '连载'
        },
        {
          id: 4,
          title: '归途如梦',
          readCount: '8.5万',
          rating: '4.6',
          category: '古代',
          status: '完结'
        }
      ];
    } catch (error) {
      console.error('获取热门排行榜失败:', error);
      return [];
    }
  },

  /**
   * 获取新书上架数据
   */
  async getNewBooks() {
    try {
      // 实际项目中应该调用 API 获取数据
      // const res = await homeApi.getNewBooks();
      // return res.data;

      // 模拟数据
      return [
        {
          id: 5,
          title: '春风十里',
          author: '周小天',
          coverUrl: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 6,
          title: '时光倒流',
          author: '林小北',
          coverUrl: 'https://images.unsplash.com/photo-1518744386442-2d48ac55549f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 7,
          title: '未来可期',
          author: '陈子轩',
          coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 8,
          title: '心之所向',
          author: '杨雨晴',
          coverUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        }
      ];
    } catch (error) {
      console.error('获取新书上架失败:', error);
      return [];
    }
  },

  /**
   * 搜索栏点击事件
   */
  onTapSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  /**
   * 轮播图点击事件
   */
  onTapBanner(e) {
    const { banner } = e.detail;
    if (banner.link) {
      wx.navigateTo({
        url: banner.link
      });
    }
  },

  /**
   * 推荐小说查看更多
   */
  onMoreRecommend() {
    wx.navigateTo({
      url: '/pages/category/category?type=recommend'
    });
  },

  /**
   * 热门排行榜查看更多
   */
  onMoreHotRanking() {
    wx.navigateTo({
      url: '/pages/category/category?type=hot'
    });
  },

  /**
   * 新书上架查看更多
   */
  onMoreNewBooks() {
    wx.navigateTo({
      url: '/pages/category/category?type=new'
    });
  },

  /**
   * 点击分类
   */
  onTapCategory(e) {
    const { category } = e.detail;
    wx.navigateTo({
      url: `/pages/category/category?id=${category.id}&name=${category.name}`
    });
  },

  /**
   * 点击书籍
   */
  onTapBook(e) {
    const { book } = e.detail;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${book.id}`
    });
  },

  /**
   * 热门排行榜项点击
   */
  onTapRankingItem(e) {
    const { book } = e.detail;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${book.id}`
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 首页不需要加载更多
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '小说阅读 - 发现好书',
      path: '/pages/home/home'
    };
  }
}) 