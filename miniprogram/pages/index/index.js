// miniprogram/pages/index/index.js
import { throttle, format } from "../../util/index";
const throttle1 = throttle()
const throttle2 = throttle()
var throttle3 = throttle()
var throttle4 = throttle()
const width = wx.getSystemInfoSync().windowWidth
const app = getApp()
var clientY, pageY, long
var Top = 0, refreshTop

Page({
  data: {
    mail: [],
    type: 'main',
    account: [],
    now: null,
    sidebar: false,
    // translate and select
    x: 0,
    selectList: [],
    rotate: [],
    // top display
    refresh_position: 0,
    // refresh
    refreshing: false,
    search_display: false,
  },
  store(e) {
    if (this.data.sidebar) return;
    const index = e.currentTarget.dataset.index
    let mail = this.data.mail[index]
    mail.star = !mail.star
    this.setData({ mail: this.data.mail })
  },
  changeNow(e) {
    const { addr } = e.detail
    console.log(addr)
    if (addr) {
      wx.reLaunch({
        url: `/pages/index/index?account=${addr}`,
        error:console.error
      })
    }
  },
  // Move
  touchStart(e) {
    const index = e.currentTarget.dataset.index
    long = e.changedTouches[0].clientX;
  },
  touchMove(e) {
    const clientX = e.changedTouches[0].clientX
    const x = this.data.x
    const m = (clientX - long) / width * 100
    if (Math.abs(m) > 50) {
      console.log('do something');
    }
    if (x !== 0 || Math.abs(m) > 10) {
      const rotate = this.data.rotate
      if (rotate) this.select()
      // throttle1(50, () => {
      this.setData({ x: m + '%' })
      // })
    }
  },
  touchEnd() {
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
  removeItem() {
    let { selectList, mail } = this.data
    mail = mail.filter((v, i) => !selectList[i])
    this.setData({ mail, selectList: [], rotate: [] })
  },
  // sidebar
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
  setType(e) {
    const t = e.detail
    this.setData({ type: t, sidebar: false })
  },
  // rotate
  select(e) {
    const index = e.currentTarget.dataset.index
    const { rotate, selectList } = this.data
    selectList[index] = !selectList[index]
    rotate[index] = !rotate[index]
    this.setData({ rotate })
    setTimeout(() => {
      this.setData({ selectList })
    }, 300)
  },
  // onload
  onLoad: async function (options) {
    const oa = options.account
    var self = this
    await wx.cloud.callFunction({
      name: 'account'
    }).then(({ result }) => {
      let now = result[0]
      if (oa) {
        now = result.find(v => v.addr = oa)
      }
      self.setData({ account: result, now })
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
  onReady: function () {

  },
  onShow: function () {
    wx.hideHomeButton()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  // 下拉刷新 上拉搜索
  refresh() {
    const { now, mail } = this.data
    const seqno = mail[0].seqno
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
  },
  touchstart(e) {
    let _ = { clientY, pageY } = e.changedTouches[0]
  },
  touchmove(e) {
    const { clientY: cY, pageY: pY } = e.changedTouches[0]
    const top = clientY == pageY
    const search_display = this.data.search_display
    if (top && cY > clientY) {
      // refresh
      const refresh_position = cY - refreshTop > 360 ? 360 : isNaN(cY - refreshTop) ? 0 : cY - refreshTop
      throttle3(30000, () => {
        refreshTop = cY
      })
      if (refresh_position === 270) {
        throttle4(60000, () => {
          console.log('refresh')
          this.refresh()
        })
      }
      this.setData({ refresh_position })
    }
    // search_display
    if (Top === 0) {
      throttle2(1000, () => {
        this.setData({ search_display: false })
      })
    } else if (cY > clientY && !search_display) {
      this.setData({ search_display: true })
    }

    let _ = { clientY, pageY } = e.changedTouches[0]
  },
  touchend(e) {
    throttle3 = throttle()
    throttle4 = throttle()
    this.setData({ refresh_position: 0 })
  },
  onPageScroll(e) {
    Top = e.scrollTop
  },
  onReachBottom() {
    console.log('bottom')
    const { mail, now } = this.data
    const seqno = mail[mail.length - 1].seqno
    wx.cloud.callFunction({
      name: 'receive',
      data: {
        num: seqno,
        account: now,
        type: 'down'
      }
    }).then(res => {
      if (res.result === null) return console.log('没有更多邮件');
      mail.push(...res.result)
      this.setData({ mail })
    })
  }
})