Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '搜索你感兴趣的小说'
    },
    value: {
      type: String,
      value: ''
    },
    focus: {
      type: Boolean,
      value: false
    },
    showCancel: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击搜索栏
     */
    onTapSearch() {
      this.triggerEvent('click');
    },

    /**
     * 输入内容变化
     */
    onInputChange(e) {
      const value = e.detail.value;
      this.setData({ inputValue: value });
      this.triggerEvent('input', { value });
    },

    /**
     * 点击确认搜索
     */
    onConfirmSearch(e) {
      const value = e.detail.value || this.data.inputValue;
      this.triggerEvent('search', { value });
    },

    /**
     * 清空输入
     */
    onClearInput() {
      this.setData({ inputValue: '' });
      this.triggerEvent('clear');
    },

    /**
     * 点击取消
     */
    onCancel() {
      this.triggerEvent('cancel');
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      this.setData({
        inputValue: this.properties.value
      });
    }
  },

  /**
   * 监听属性变化
   */
  observers: {
    'value': function(value) {
      this.setData({
        inputValue: value
      });
    }
  }
}) 