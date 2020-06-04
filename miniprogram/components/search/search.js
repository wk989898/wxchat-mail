// components/search/search.js
Component({
  properties: {
    search_display: Boolean,
    now: Object
  },
  data: {
    isSearch: false,
    account: false
  },
  methods: {
    openSidebar() {
      this.triggerEvent('Sidebar')
    },
    focus() {
      this.setData({ isSearch: true })
    },
    back() {
      this.setData({ isSearch: false })
    },
    selectAccount() {
      this.setData({ account: true })
    },
    changeAccount(e) {
      const { addr } = e.detail
      if (addr) {
        this.triggerEvent('changeAccount', { addr })
      }
      this.setData({ account: false })
    },
    move() {
    }
  },
  options: {
    styleIsolation: 'isolated'
  }
})
