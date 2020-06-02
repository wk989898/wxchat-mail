// components/search/search.js
const app=getApp()

Component({
  properties: {
    search_display:Boolean,
    account:{
      type:Array,
    },
    now:{
      type:Object
    }
  },
  data: {
    isSearch:false,
  },
  methods: {
    openSidebar(){
      this.triggerEvent('Sidebar')
    },
    focus(){
      this.setData({isSearch:true})
    },
    back(){
      this.setData({isSearch:false})
    },
    selectAccount(){
      console.log('select');
    }
  },
  options: {
    styleIsolation: 'isolated'
  }
})
