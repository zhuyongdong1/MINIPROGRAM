const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bookId: '', // 图书ID
    chapterId: 1, // 章节ID
    bookInfo: null, // 图书信息
    chapterInfo: null, // 章节信息
    chapterContent: '', // 章节内容
    chapterList: [], // 章节列表
    loading: true, // 加载状态
    showMenu: false, // 是否显示菜单
    showChapterList: false, // 是否显示章节列表
    showSettings: false, // 是否显示设置
    fontSize: 36, // 字体大小，单位rpx
    lineHeight: 1.8, // 行高
    theme: 'default', // 主题：default-默认，night-夜间，paper-纸张
    themes: [
      { id: 'default', name: '默认', bg: '#ffffff', color: '#333333' },
      { id: 'night', name: '夜间', bg: '#1a1a1a', color: '#999999' },
      { id: 'paper', name: '纸张', bg: '#f8f3e8', color: '#5c5b56' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onTapBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  
  onLoad: function (options) {
    const { id, chapterId } = options;
    
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
    
    // 读取用户设置
    this.loadSettings();
    
    this.setData({
      bookId: id,
      chapterId: parseInt(chapterId || 1)
    });
    
    // 加载数据
    this.loadBookInfo();
    this.loadChapterList();
    this.loadChapterContent();
  },

  /**
   * 加载用户设置
   */
  loadSettings() {
    try {
      const settings = wx.getStorageSync('readingSettings');
      if (settings) {
        this.setData({
          fontSize: settings.fontSize || 36,
          lineHeight: settings.lineHeight || 1.8,
          theme: settings.theme || 'default'
        });
      }
    } catch (error) {
      console.error('读取设置失败:', error);
    }
  },

  /**
   * 保存用户设置
   */
  saveSettings() {
    try {
      const { fontSize, lineHeight, theme } = this.data;
      wx.setStorageSync('readingSettings', { fontSize, lineHeight, theme });
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  },

  /**
   * 加载图书信息
   */
  async loadBookInfo() {
    try {
      // 模拟请求延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 获取模拟数据
      const bookInfo = this.getMockBookInfo();
      
      this.setData({ bookInfo });
      
      // 更新页面标题
      wx.setNavigationBarTitle({ title: bookInfo.title });
      
    } catch (error) {
      console.error('加载图书信息失败:', error);
      wx.showToast({
        title: '加载图书信息失败',
        icon: 'none'
      });
    }
  },

  /**
   * 加载章节列表
   */
  async loadChapterList() {
    try {
      // 模拟请求延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 获取模拟数据
      const chapterList = this.getMockChapterList();
      
      this.setData({ chapterList });
      
    } catch (error) {
      console.error('加载章节列表失败:', error);
      wx.showToast({
        title: '加载章节列表失败',
        icon: 'none'
      });
    }
  },

  /**
   * 加载章节内容
   */
  async loadChapterContent() {
    try {
      this.setData({ loading: true });
      
      // 模拟请求延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 获取模拟数据
      const chapterInfo = this.getMockChapterInfo();
      const chapterContent = this.getMockChapterContent();
      
      this.setData({
        chapterInfo,
        chapterContent,
        loading: false
      });
      
      // 保存阅读记录
      this.saveReadingRecord();
      
    } catch (error) {
      console.error('加载章节内容失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载章节内容失败',
        icon: 'none'
      });
    }
  },

  /**
   * 保存阅读记录
   */
  saveReadingRecord() {
    try {
      // 更新最近阅读
      let recentBooks = wx.getStorageSync('recentBooks') || [];
      
      // 找到当前书籍的索引
      const index = recentBooks.findIndex(book => book.id === this.data.bookId);
      
      if (index > -1) {
        // 更新已存在的记录
        recentBooks[index].progress = Math.floor(this.data.chapterId / this.data.chapterList.length * 100);
        recentBooks[index].lastReadTime = new Date().toLocaleString('zh', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
        
        // 移动到最前面
        const book = recentBooks.splice(index, 1)[0];
        recentBooks.unshift(book);
      } else {
        // 添加新记录
        recentBooks.unshift({
          id: this.data.bookId,
          title: this.data.bookInfo.title,
          author: this.data.bookInfo.author,
          coverUrl: this.data.bookInfo.coverUrl,
          progress: Math.floor(this.data.chapterId / this.data.chapterList.length * 100),
          lastReadTime: new Date().toLocaleString('zh', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
        });
        
        // 只保留最近的10本书
        if (recentBooks.length > 10) {
          recentBooks = recentBooks.slice(0, 10);
        }
      }
      
      // 保存数据
      wx.setStorageSync('recentBooks', recentBooks);
      
    } catch (error) {
      console.error('保存阅读记录失败:', error);
    }
  },

  /**
   * 切换菜单显示
   */
  toggleMenu() {
    this.setData({
      showMenu: !this.data.showMenu,
      showChapterList: false,
      showSettings: false
    });
  },

  /**
   * 切换章节列表显示
   */
  toggleChapterList() {
    this.setData({
      showChapterList: !this.data.showChapterList,
      showSettings: false
    });
  },

  /**
   * 切换设置显示
   */
  toggleSettings() {
    this.setData({
      showSettings: !this.data.showSettings,
      showChapterList: false
    });
  },

  /**
   * 切换到上一章
   */
  prevChapter() {
    if (this.data.chapterId <= 1) {
      wx.showToast({
        title: '已经是第一章',
        icon: 'none'
      });
      return;
    }
    
    const chapterId = this.data.chapterId - 1;
    this.setData({
      chapterId,
      showMenu: false,
      showChapterList: false,
      showSettings: false
    });
    
    this.loadChapterContent();
  },

  /**
   * 切换到下一章
   */
  nextChapter() {
    if (this.data.chapterId >= this.data.chapterList.length) {
      wx.showToast({
        title: '已经是最后一章',
        icon: 'none'
      });
      return;
    }
    
    const chapterId = this.data.chapterId + 1;
    this.setData({
      chapterId,
      showMenu: false,
      showChapterList: false,
      showSettings: false
    });
    
    this.loadChapterContent();
  },

  /**
   * 点击选择章节
   */
  onTapChapter(e) {
    const chapterId = e.currentTarget.dataset.id;
    
    if (chapterId === this.data.chapterId) {
      this.setData({
        showChapterList: false
      });
      return;
    }
    
    this.setData({
      chapterId,
      showMenu: false,
      showChapterList: false,
      showSettings: false
    });
    
    this.loadChapterContent();
  },

  /**
   * 调整字体大小
   */
  changeFontSize(e) {
    const type = e.currentTarget.dataset.type;
    let { fontSize } = this.data;
    
    if (type === 'increase') {
      fontSize = Math.min(fontSize + 2, 48);
    } else {
      fontSize = Math.max(fontSize - 2, 28);
    }
    
    this.setData({ fontSize });
    this.saveSettings();
  },

  /**
   * 调整行高
   */
  changeLineHeight(e) {
    const type = e.currentTarget.dataset.type;
    let { lineHeight } = this.data;
    
    if (type === 'increase') {
      lineHeight = parseFloat((Math.min(lineHeight + 0.1, 2.4)).toFixed(1));
    } else {
      lineHeight = parseFloat((Math.max(lineHeight - 0.1, 1.4)).toFixed(1));
    }
    
    this.setData({ lineHeight });
    this.saveSettings();
  },

  /**
   * 切换主题
   */
  changeTheme(e) {
    const theme = e.currentTarget.dataset.theme;
    this.setData({ theme });
    this.saveSettings();
  },

  /**
   * 返回图书详情
   */
  backToDetail() {
    wx.navigateBack();
  },

  /**
   * 获取模拟图书信息
   */
  getMockBookInfo() {
    return {
      id: this.data.bookId,
      title: `图书标题${this.data.bookId}`,
      author: '知名作家',
      coverUrl: `https://picsum.photos/200/300?random=${this.data.bookId}`
    };
  },

  /**
   * 获取模拟章节列表
   */
  getMockChapterList() {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `第${i + 1}章 ${i < 10 ? '初入江湖' : '修炼有成'}${i}`
    }));
  },

  /**
   * 获取模拟章节信息
   */
  getMockChapterInfo() {
    const chapter = this.data.chapterList.find(chapter => chapter.id === this.data.chapterId) || {
      id: this.data.chapterId,
      title: `第${this.data.chapterId}章`
    };
    
    return {
      id: chapter.id,
      title: chapter.title,
      wordCount: Math.floor(Math.random() * 3000) + 2000,
      updateTime: new Date(Date.now() - chapter.id * 86400000).toLocaleDateString('zh', { month: 'numeric', day: 'numeric' })
    };
  },

  /**
   * 获取模拟章节内容
   */
  getMockChapterContent() {
    const paragraphs = [];
    const count = Math.floor(Math.random() * 10) + 15;
    
    paragraphs.push(`    这是第${this.data.chapterId}章的内容。`);
    
    for (let i = 0; i < count; i++) {
      if (i % 5 === 0) {
        paragraphs.push('');
        paragraphs.push(`    "这是一段对话内容，演示小说中的对白场景。"${i % 2 === 0 ? '主角' : '配角'}说道。`);
      } else {
        const length = Math.floor(Math.random() * 100) + 50;
        let content = '    ';
        for (let j = 0; j < length; j++) {
          content += '文字';
        }
        paragraphs.push(content);
      }
    }
    
    return paragraphs.join('\n');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 隐藏菜单
    this.setData({
      showMenu: false,
      showChapterList: false,
      showSettings: false
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `${this.data.bookInfo?.title} - ${this.data.chapterInfo?.title}`,
      path: `/pages/reading/reading?id=${this.data.bookId}&chapterId=${this.data.chapterId}`
    };
  }
}) 