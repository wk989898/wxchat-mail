// miniprogram/pages/set/index.js
const app = getApp()

Page({
  data: {
    account: [],
  },
  onShow() {
    const account = app.globalData.account
    this.setData({ account })
  },
  addAccount() {
    wx.navigateTo({
      url: '/pages/login/index',
      fail: console.error
    })
  },
  delete(e) {
    const addr = e.currentTarget.dataset.addr
    wx.cloud.callFunction({
      name: 'account',
      data: { addr }
    }).then(res => {
      console.log(res.result);
      const length = res.result
      if (length === 0)
        wx.redirectTo({
          url: '/pages/login/index',
        })
      else
        wx.cloud.callFunction({
          name: 'account'
        }).then(({ result }) => {
          this.setData({ account: result })
          app.globalData.account = result
        })
    })
  }
})