// components/sidebar/sidebar.js
Component({
  properties: {
  },
  data: {
    type: 'main'
  },
  methods: {
    select(e) {
      const type = e.currentTarget.dataset.type
      if (/^(about|set)$/.test(type)) {
        wx.navigateTo({
          url: `/pages/${type}/index`,
        })
        return;
      }
      this.setData({ type })
      this.triggerEvent('type', type)
    }
  },
  options: {
    styleIsolation: 'isolated'
  }
})
