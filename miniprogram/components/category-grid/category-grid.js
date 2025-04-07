Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    categories: {
      type: Array,
      value: []
    },
    columnCount: {
      type: Number,
      value: 4
    },
    showMore: {
      type: Boolean,
      value: false
    },
    moreText: {
      type: String,
      value: '查看全部'
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
     * 点击分类
     */
    onTapCategory(e) {
      const { index } = e.currentTarget.dataset;
      const category = this.properties.categories[index];
      this.triggerEvent('tap', { category, index });
    },

    /**
     * 点击查看更多
     */
    onTapMore() {
      this.triggerEvent('more');
    }
  }
}) 