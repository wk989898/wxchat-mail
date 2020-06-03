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
      if (type !== 'set'){
        this.setData({ type })
        this.triggerEvent('type', type)
      }else wx.navigateTo({
        url: '/pages/set/index',
      })
    }
  },
  options: {
    styleIsolation: 'isolated'
  }
})
