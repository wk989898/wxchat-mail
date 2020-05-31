// components/add/add.js
Component({
  methods: {
    write() {
      wx.navigateTo({
        url: '/pages/send/index',
        success(e){
        },
        fail:console.error
      })
    }
  },
  options: {
    styleIsolation: 'isolated'
  }
})
