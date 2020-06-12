// miniprogram/pages/index/index.js
import { throttle } from "../../util/index";
const throttle1 = throttle()
const throttle2 = throttle()
var throttle3 = throttle()
var throttle4 = throttle()
const width = wx.getSystemInfoSync().windowWidth
const app = getApp()
var clientY, clientX, pageY, long
var Top = 0, refreshTop, getMore

Page({
  data: {
    mail: [],
    type: 'main',
    account: [],
    now: null,
    // sidebar
    sidebar: false,
    sidebarX: 0,
    // translate and select
    x: 0,
    idx: 0,
    selectList: [],
    rotate: [],
    translate: false,
    // top display
    refresh_position: 0,
    // refresh
    refreshing: false,
    search_display: false,
  },
  store(e) {
    const index = e.currentTarget.dataset.index
    const { mail } = this.data
    const m = this.data.mail[index]
    m.star = !m.star
    this.setData({ mail })
  },
  changeNow(e) {
    const { addr } = e.detail
    console.log(addr)
    if (addr) {
      wx.reLaunch({
        url: `/pages/index/index?account=${addr}`,
        error: console.error
      })
    }
  },
  // Move
  touchStart(e) {
    const index = e.currentTarget.dataset.index
    long = e.changedTouches[0].clientX
    this.setData({ idx: index })
  },
  touchMove(e) {
    const { x, idx, refreshing } = this.data
    if (refreshing || clientX < 10) return;
    const cX = e.changedTouches[0].clientX
    const m = (cX - long) / width * 100
    if (x !== 0 || Math.abs(m) > 15) {
      const rotate = this.data.rotate[idx]
      if (rotate) this.select(e)
      throttle1(50, () => {
        this.setData({ x: m + '%', translate: true })
      })
    }
  },
  touchEnd() {
    const { mail, idx, x } = this.data
    const m = parseFloat(x)
    const direction = m > 0 ? '' : '-'
    if (Math.abs(m) > 55) {
      mail.splice(idx, 1)
      this.setData({ x: `${direction}100%`, translate: false, mail })
      setTimeout(() => {
        this.setData({ x: 0 })
      }, 300);
    } else this.setData({ x: 0, translate: false })
  },

  getItem(e) {
    // if (this.data.sidebar) return;
    const index = e.currentTarget.dataset.index
    const mail = this.data.mail
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
  topBack() {
    this.setData({ selectList: [], rotate: [] })
  },
  
  // sidebar
  setSidebar() {
    const { sidebarX } = this.data
    if (parseFloat(sidebarX) >= 50) return this.setData({ sidebar: true, sidebarX: 0 })
    this.setData({ sidebar: false, sidebarX: 0 })
  },
  openSidebar() {
    console.log('open Sidebar');
    this.setData({ sidebar: true })
  },
  // 卡顿明显
  // move(e) {
  //   const { clientX } = e.changedTouches[0]
  //   const m = clientX / width * 100
  //   if (m <= 80) {
  //     this.setData({ sidebarX: m + '%', sidebar: false })
  //   } else this.setData({ sidebar: true })
  // },
  // moveEnd() {
  //   this.setSidebar()
  // },
  closeSidebar() {
    if (this.data.sidebar) {
      console.log('close Sidebar');
      this.setData({ sidebar: false })
    }
  },
  // 分类
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
    }, 350)
  },
  // onload
  onLoad: async function (options) {
    const oa = options.account
    var self = this
    await wx.cloud.callFunction({
      name: 'account'
    }).then(({ result }) => {
      if (result.length === 0) {
        return wx.redirectTo({
          url: '/pages/login/index'
        })
      }
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
  touchstart(e) {
    let _ = { clientY, pageY, clientX } = e.changedTouches[0]
  },
  touchmove(e) {
    const { clientY: cY, clientX: cX } = e.changedTouches[0]
    // sidebar
    if (clientX < 10) {
      let m = cX / width * 100
      m = m >= 80 ? 80 : m
      this.setData({ sidebarX: m + '%' })
      return;
    }

    const top = clientY == pageY
    const { search_display, translate, refreshing } = this.data
    if (top && (cY - clientY) > 5 && !translate && !refreshing) {
      this.setData({ refreshing: true })
    }
    if (top && !translate && refreshing) {
      // refresh
      let refresh_position = isNaN(cY - refreshTop) ? 0 : cY - refreshTop
      refresh_position > 360 && (refresh_position = 360)
      refresh_position < 0 && (refresh_position = 0)
      throttle3(30000, () => {
        refreshTop = cY
      })
      throttle4(50, () => {
        this.setData({ refresh_position })
      })
    }
    // search_display
    if (Top === 0) {
      throttle2(1000, () => {
        this.setData({ search_display: false })
      })
    } else if (cY - clientY > 5 && !search_display) {
      this.setData({ search_display: true })
    }

    let _ = { clientY, pageY } = e.changedTouches[0]
  },
  touchend() {
    this.setSidebar()
    const { refresh_position } = this.data
    throttle3 = throttle()
    if (refresh_position > 270) {
      console.log('refresh')
      this.refresh()
      getMore = true
    } else getMore = false
    this.setData({ refresh_position: getMore ? -1 : 0, refreshing: false })
  },

  refresh() {
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
      getMore = false
      if (res.result === null) {
        console.log('没有新的邮件');
        this.setData({ refresh_position: 0 })
        return
      }
      mail.unshift(...res.result)
      this.setData({ mail, refresh_position: 0 })
    })
  },
  onPageScroll(e) {
    Top = e.scrollTop
  },
  onReachBottom() {
    if (getMore) return;
    console.log('load more ...');
    getMore = true
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
      getMore = false
      if (res.result === null) return console.log('没有更多邮件');
      mail.push(...res.result)
      this.setData({ mail })
    })
  }
})