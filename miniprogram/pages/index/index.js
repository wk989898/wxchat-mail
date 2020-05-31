// miniprogram/pages/index/index.js
import { throttle, format } from "../../util/index";
let dy
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
    x: 0,
    idx: 0,
    rotate: false,
    // top
    active: false,
    refreshing: false,
    scrolling: false,
    TopRefresh_display: false,
    total: 0,
    //refresh
    search_display: false
  },
  store(e) {
    if (this.data.sidebar) return;
    const index = e.currentTarget.dataset.index
    console.log();
    let mail = this.data.mail[index]
    mail.star = !mail.star
    this.setData({ mail: this.data.mail })
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
  scroll(e) {
    console.log(e);
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
    wx.cloud.callFunction({
      name: 'receive',
      data: {
        // default
        num: 2,
        account
      }
    }).then(res => {
      console.log(res)
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
        console.log(mail)
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
    this.setData({TopRefresh_display:true})
    dy = e.detail.dy
    console.log('refresh');
    setTimeout(() => {
      this.setData({ refreshing: false,TopRefresh_display:false })
    }, 1500);
  },
  refreshPull(e) {
    
  }

  // touchstart(e) {
  //   let _ = { clientX, clientY, pageX, pageY } = e.changedTouches[0]
  //   console.log(e.changedTouches[0]);
  //   return e
  // },
  // touchmove(e) {
  //   const { clientX: cX, clientY: cY, pageX: pX, pageY: pY } = e.changedTouches[0]
  //   const x = Math.abs(cX - pageX)
  //   const y = cY - pageY
  //   const top = clientY === pageY ? true : false
  //   if (!top) {
  //     console.log('search dispaly');
  //     const search_display = this.data.search_display
  //     !search_display && this.setData({ search_display: true })
  //   } else {
  //     if (x < 10 && y > 10) {
  //       console.log('refresh');
  //     }
  //   }
  //   console.log(clientX, clientY, pageX, pageY);
  //   return e

  // },
  // touchend(e) {
  //   console.log('end', e.changedTouches[0]);
  //   return e
  // }
})