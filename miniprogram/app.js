// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    this.getUserInfo()

    // 初始化阅读设置
    this.initReadingSettings()
  },

  // 获取用户信息
  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      this.globalData.hasUserInfo = true
    }
  },

  // 保存用户信息
  saveUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
    this.globalData.hasUserInfo = true
    wx.setStorageSync('userInfo', userInfo)
  },

  // 清除用户信息
  clearUserInfo() {
    this.globalData.userInfo = null
    this.globalData.hasUserInfo = false
    wx.removeStorageSync('userInfo')
  },

  // 初始化阅读设置
  initReadingSettings() {
    const settings = wx.getStorageSync('readingSettings')
    if (settings) {
      this.globalData.readingSettings = settings
    } else {
      // 默认阅读设置
      const defaultSettings = {
        fontSize: 16,
        lineHeight: 1.8,
        theme: 'default'
      }
      this.globalData.readingSettings = defaultSettings
      wx.setStorageSync('readingSettings', defaultSettings)
    }
  },

  // 保存阅读设置
  saveReadingSettings(settings) {
    this.globalData.readingSettings = settings
    wx.setStorageSync('readingSettings', settings)
  },

  // 添加到书架
  addToBookshelf(book) {
    // 获取当前书架
    let bookshelf = wx.getStorageSync('bookshelf') || []
    
    // 检查是否已存在
    const index = bookshelf.findIndex(item => item.id === book.id)
    if (index === -1) {
      // 添加时间戳
      book.addTime = Date.now()
      bookshelf.push(book)
      wx.setStorageSync('bookshelf', bookshelf)
      return true
    }
    return false
  },

  // 从书架移除
  removeFromBookshelf(bookId) {
    let bookshelf = wx.getStorageSync('bookshelf') || []
    const newBookshelf = bookshelf.filter(item => item.id !== bookId)
    wx.setStorageSync('bookshelf', newBookshelf)
    return newBookshelf.length !== bookshelf.length
  },

  // 检查是否在书架中
  isInBookshelf(bookId) {
    const bookshelf = wx.getStorageSync('bookshelf') || []
    return bookshelf.some(item => item.id === bookId)
  },

  // 获取书架内容
  getBookshelf() {
    return wx.getStorageSync('bookshelf') || []
  },

  // 更新最近阅读记录
  updateRecentReading(book, chapter) {
    let recentReading = wx.getStorageSync('recentReading') || []
    
    // 移除已存在的相同书籍
    recentReading = recentReading.filter(item => item.bookId !== book.id)
    
    // 添加到最前面
    recentReading.unshift({
      bookId: book.id,
      bookName: book.title,
      bookCover: book.cover,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      timestamp: Date.now()
    })
    
    // 限制最多保存10本
    if (recentReading.length > 10) {
      recentReading = recentReading.slice(0, 10)
    }
    
    wx.setStorageSync('recentReading', recentReading)
  },

  // 获取最近阅读
  getRecentReading() {
    return wx.getStorageSync('recentReading') || []
  },

  globalData: {
    userInfo: null,
    hasUserInfo: false,
    readingSettings: null,
    version: '1.0.0'
  }
})
