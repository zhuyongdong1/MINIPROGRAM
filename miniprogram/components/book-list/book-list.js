Component({
  /**
   * 组件的属性列表
   */
  properties: {
    books: {
      type: Array,
      value: []
    },
    title: {
      type: String,
      value: ''
    },
    showMoreLink: {
      type: Boolean,
      value: false
    },
    moreText: {
      type: String,
      value: '查看更多'
    },
    moreUrl: {
      type: String,
      value: ''
    },
    horizontal: {
      type: Boolean,
      value: true
    },
    columnCount: {
      type: Number,
      value: 2
    },
    bookWidth: {
      type: Number,
      value: 220 // rpx
    },
    bookHeight: {
      type: Number,
      value: 300 // rpx
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击查看更多
     */
    onTapMore() {
      if (this.data.moreUrl) {
        wx.navigateTo({
          url: this.data.moreUrl
        });
      }
      
      this.triggerEvent('tapmore');
    },

    /**
     * 点击书籍项
     */
    onTapBook(e) {
      const index = e.currentTarget.dataset.index;
      const book = this.data.books[index];
      
      this.triggerEvent('tapbook', {
        bookId: book.id,
        book: book
      });
      
      // 导航到书籍详情页
      wx.navigateTo({
        url: `/pages/book-detail/book-detail?id=${book.id}`
      });
    }
  }
}) 