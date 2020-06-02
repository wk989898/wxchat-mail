// miniprogram/pages/body/index.js
const app = getApp();
Page({
  data: {
    subject: '',
    name: '',
    to: '',
    time: '',
    isLoading: true,
    article: null
  },
  onLoad: function (options) {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('mail', function (data) {
      const { body, subject, name, time, to } = data
      let article = app.towxml(body, 'html');
      that.setData({
        subject, name, to, time,
        article, isLoading: false
      })

    })
  },
  onReady: function () {
    console.log(this.data);
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