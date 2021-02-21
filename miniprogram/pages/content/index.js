// miniprogram/pages/body/index.js
Page({
  data: {
    subject: '',
    name: '',
    to: '',
    time: '',
    from: '',
    isLoading: true,
    article: null
  },
  onLoad: function (options) {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('mail', function (data) {
      const { body, subject, name, time, to, from } = data
      that.setData({
        subject, name, to, time, from,
        article:body, isLoading: false
      })
    })
  },
  reply() {
    console.log('reply');
    const { from, subject } = this.data
    wx.navigateTo({
      url: `/pages/send/index?to=${from}&subject=${subject}`
    })
  },
  relay() {
    console.log('relay');
    const { subject } = this.data
    wx.navigateTo({
      url: `/pages/send/index?subject=${subject}`
    })
  }
})