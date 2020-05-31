// miniprogram/pages/mail/index.js
const app = getApp()

Page({
  data: {
    account: [],
    account_index: 0,
    to: '',
    from: '',
    subject: '',
    html: '',
    msg: ''
  },
  picker() {
    const from = this.data.account[this.data.account_index].addr
    this.setData({ from })
  },
  send() {
    const { to, subject, html, account, account_index } = this.data
    const pattern = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
    let temp = to.split(';')
    for (let i of temp) {
      if (pattern.test(i)) {
        console.log('收件人:', i);
      } else
        return this.setData({ msg: '收件人邮箱不正确' })
    }
    this.setData({ msg: '' })
    wx.cloud.callFunction({
      name: 'send',
      data: { to, subject, html, account: account[account_index] }
    }).then(res => {
      console.log(res.result)
      wx.navigateBack()
    })
  },
  entry(e) {
    let detail = e.detail, type = e.currentTarget.dataset.type
    if (type === 'content') {
      this.setData({ html: detail.html })
    }
    else
      this.setData({ [type]: detail.value })
  },
  onLoad: function (options) {
    const account = app.globalData.account
    this.setData({ account })
    this.picker()
  },
  onUnload: function () {
    this.setData({
      account: [],
      account_index: 0,
      to: '',
      from: '',
      subject: '',
      html: '',
      msg: ''
    })
  },

})