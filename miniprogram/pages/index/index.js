// miniprogram/pages/index/index.js
import { throttle, format } from "../../util/index";
let dy, long
const width = wx.getSystemInfoSync().windowWidth
const app = getApp()
var clientX, clientY, pageX, pageY

Page({
  data: {
    mail: [],
    type: 'all',
    account: [],
    now: null,
    sidebar: false,
    // translate and select
    x: 0,
    idx: 0,
    rotate: false,
    active: false,
    // top display
    TopRefresh_display: false,
    // refresh
    refreshing: false,
    search_display: false,
    // scroll
    scroll_top:10
  },
  store(e) {
    if (this.data.sidebar) return;
    const index = e.currentTarget.dataset.index
    console.log();
    let mail = this.data.mail[index]
    mail.star = !mail.star
    this.setData({ mail: this.data.mail })
  },

  touchStart(e) {
    console.log('touchStart');
    const index = e.currentTarget.dataset.index
    long = e.changedTouches[0].clientX;
    this.setData({ idx: index })
  },
  touchMove(e) {
    const clientX = e.changedTouches[0].clientX
    const x=this.data.x
    const m = (clientX - long) / width * 100
    if (Math.abs(m) > 50) {
      console.log('do something');
    }
    if (x!==0||Math.abs(m) > 10)
      throttle(50, () => {
        this.setData({ x: m + '%' })
      })
  },
  touchEnd() {
    console.log('touchEnd');
    setTimeout(() => {
      this.setData({ x: 0 })
    }, 50);
  },

  getItem(e) {
    if (this.data.sidebar) return;
    const index = e.currentTarget.dataset.index
    const mail = this.data.mail
    console.log('getItem', index);
    wx.navigateTo({
      url: '/pages/content/index',
      success(res) {
        res.eventChannel.emit('mail', mail[index])
      },
      fail: console.error
    })
  },
  openSidebar() {
    console.log('open Sidebar');
    this.setData({ sidebar: true })
  },
  closeSidebar() {
    if (this.data.sidebar) {
      console.log('close Sidebar');
      this.setData({ sidebar: false })
    }
  },
  // rotate
  select() {
    this.setData({ rotate: !this.data.rotate })
    setTimeout(() => {
      this.setData({ active: !this.data.active })
    }, 300);
  },
  // onload

  onLoad: async function (options) {
    var self = this
    await wx.cloud.callFunction({
      name: 'account'
    }).then(({ result }) => {
      // default 
      self.setData({ account: result, now: result[0] })
      app.globalData.account = result
    })
    //当前账户
    const account = self.data.now
    await wx.cloud.callFunction({
      name: 'receive',
      data: {
        // default
        num: 2,
        account
      }
    }).then(res => {
      app.globalData.email.push(...res.result)
      self.setData({ mail: res.result })
      // 缓冲加载
      const seqno = res.result[res.result.length - 1].seqno || 0
      wx.cloud.callFunction({
        name: 'receive',
        data: {
          num: seqno,
          account,
          type: 'down'
        }
      }).then(r => {
        const mail = res.result.concat(r.result)
        self.setData({ mail })
      })
    })
  },

  setType(e) {
    const t = e.detail
    let mail = this.data.mail
    this.setData({ type: t, sidebar: false })
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
  refresh(e) {
    this.setData({ TopRefresh_display: true })
    const { now, mail } = this.data
    const seqno = mail[0].seqno || 0
    wx.cloud.callFunction({
      name: 'receive',
      data: {
        num: seqno,
        account: now,
        type: 'up'
      }
    }).then(res => {
      if (res.result === null) return console.log('没有新的邮件');
      mail.unshift(...res.result)
      this.setData({ mail })
    })
    setTimeout(() => {
      this.setData({ refreshing: false, TopRefresh_display: false })
    }, 1500);
  },
})