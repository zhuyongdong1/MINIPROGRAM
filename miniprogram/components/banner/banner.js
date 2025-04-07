Component({
  /**
   * 组件的属性列表
   */
  properties: {
    banners: {
      type: Array,
      value: []
    },
    height: {
      type: Number,
      value: 320
    },
    autoplay: {
      type: Boolean,
      value: true
    },
    interval: {
      type: Number,
      value: 3000
    },
    duration: {
      type: Number,
      value: 500
    },
    circular: {
      type: Boolean,
      value: true
    },
    indicatorDots: {
      type: Boolean,
      value: true
    },
    indicatorColor: {
      type: String,
      value: 'rgba(255, 255, 255, 0.3)'
    },
    indicatorActiveColor: {
      type: String,
      value: '#ffffff'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 轮播图变化事件
     */
    onChange(e) {
      const { current } = e.detail;
      this.setData({ current });
      this.triggerEvent('change', { current });
    },

    /**
     * 点击轮播图
     */
    onTapBanner(e) {
      const { index } = e.currentTarget.dataset;
      const banner = this.properties.banners[index];
      this.triggerEvent('tap', { banner, index });
    }
  }
}) 