// miniprogram/pages/set/index.js
const app = getApp()

Page({
  data: {
    account: [],
  },
  onShow() {
    const account = app.globalData.account
    console.log(account);
    this.setData({ account})
  },
  addAccount() {
    wx.navigateTo({
      url: '/pages/login/index',
      success(e) {
      },
      fail: console.error
    })
  },
})