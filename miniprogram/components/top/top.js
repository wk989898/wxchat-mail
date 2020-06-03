// components/top/top.js
Component({
  properties: {
    active:{
      type:Boolean,
      value:false
    }
  },
  data: {

  },
  methods: {
    back(){
      this.setData({active:false})
    },
    delete(){
      this.triggerEvent('delete')
    }
  },
  options: {
    styleIsolation: 'isolated'
  }
})
