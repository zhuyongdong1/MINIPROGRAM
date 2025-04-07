Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    books: {
      type: Array,
      value: []
    },
    showMore: {
      type: Boolean,
      value: true
    },
    moreText: {
      type: String,
      value: '查看全部'
    },
    topCount: {
      type: Number,
      value: 3
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
     * 点击排行榜项
     */
    onTapItem(e) {
      const { index } = e.currentTarget.dataset;
      const book = this.properties.books[index];
      this.triggerEvent('tap', { book, index });
    },

    /**
     * 点击查看更多
     */
    onTapMore() {
      this.triggerEvent('more');
    }
  }
}) 