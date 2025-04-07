Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 主筛选项数据
    filters: {
      type: Array,
      value: []
    },
    // 子筛选项数据
    subFilters: {
      type: Array,
      value: []
    },
    // 当前选中的主筛选项索引
    activeFilterIndex: {
      type: Number,
      value: 0
    },
    // 当前选中的子筛选项索引
    activeSubFilterIndex: {
      type: Number,
      value: 0
    },
    // 是否显示子筛选栏
    showSubFilter: {
      type: Boolean,
      value: true
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
     * 选择主筛选项
     */
    onTapFilter(e) {
      const { index } = e.currentTarget.dataset;
      if (index !== this.properties.activeFilterIndex) {
        this.triggerEvent('filterchange', { index });
      }
    },

    /**
     * 选择子筛选项
     */
    onTapSubFilter(e) {
      const { index } = e.currentTarget.dataset;
      if (index !== this.properties.activeSubFilterIndex) {
        this.triggerEvent('subfilterchange', { index });
      }
    }
  }
}) 