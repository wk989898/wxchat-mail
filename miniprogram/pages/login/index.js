// miniprogram/pages/register/index.js
const serve = [
  'google.com', 'outlook.com', 'qq.com', '163.com', ''
]
const app = getApp()
Page({
  data: {
    options: [
      {
        image: 'google.png',
        text: 'Google'
      },
      {
        image: 'outlook.jpg',
        text: 'Outlook'
      },
      {
        image: 'qq.jpg',
        text: 'QQ'
      },
      {
        image: '163.png',
        text: '网易'
      },
      {
        image: 'othermail.png',
        text: '其他'
      },
    ],
    head: '设置电子邮件',
    // 是否手动设置
    port1: '',
    port2: '465',
    step: 0,
    addr: '',
    pass: '',
    server: '',
    name: '',
    check: true,
    isPlain: false,
    msg: ''
  },
  register(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ head: '添加您的电子邮件', step: 1, server: serve[index] })
  },
  back() {
    const step = this.data.step
    this.setData({ step: step - 1 })
  },
  next() {
    const step = this.data.step
    switch (step) {
      case 1:
        this.setData({ head: this.data.addr, step: step + 1, check: true })
        break;
      case 2:
        if (!this.data.server) this.setData({
          server: this.data.addr.split('@')[1]
        })
        this.setData({ step: step + 1, head: '接受服务器设置' })
        break;
      case 3:
        const { addr, pass, server, port1, port2, name } = this.data
        let bool = [addr, pass, server, port1, port2, name].some(v => !v)
        if (bool) return this.setData({ head: '请检查输入！' });
        this.setData({ step: step + 1, head: '连接服务器' })
        wx.cloud.callFunction({
          name: 'login',
          data: {
            addr, pass, server, port1, port2, name
          }
        }).then(res => {
          if (res.result) {
            const err = res.result.split('.')[0]
            console.log(err)
            return this.setData({ step, head: err })
          }
          console.log('success login');
          wx.redirectTo({
            url: '/pages/index/index',
            fail: console.error
          })
        }).catch((e) => {
          this.setData({ step, head: '连接服务器错误' })
        })
        break;
    }
  },
  model(e) {
    const value = e.detail.value
    const type = e.currentTarget.dataset.type
    this.setData({ [type]: value })
  },
  checkPass(e) {
    const value = e.detail.value
    const type = e.currentTarget.dataset.type
    this.model(e)
    if (type === 'addr') {
      const pattern = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
      const addr = this.data.addr
      if (pattern.test(addr)) this.setData({ check: false })
    } else if (value.length > 0)
      this.setData({ check: false })
  },
  changePlain() {
    this.setData({ isPlain: !this.data.isPlain })
  },
  update(e) {
    const type = e.currentTarget.dataset.type
    let step
    if (type === 'account') {
      step = 3
    } else if (type === 'server') {
      step = 3
    } else step = 0
    this.setData({ step })
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    wx.hideHomeButton()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
})