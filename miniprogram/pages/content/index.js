// miniprogram/pages/body/index.js
const app = getApp();
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
      let article = app.towxml(body, 'html');
      console.log(body, subject, name, time, to, from);
      that.setData({
        subject, name, to, time, from,
        article, isLoading: false
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
  },
  onReady: function () {
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})