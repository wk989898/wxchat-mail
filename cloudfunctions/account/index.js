// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { addr } = event
  const openid = cloud.getWXContext().OPENID
  let mails = await db.collection('user').doc(openid).get().then(res => {
    return res.data.mails
  })
  if (addr) {
    mails = mails.filter(v => v.addr !== addr)
    await db.collection('user').doc(openid).update({
      data:{
        mails:mails
      }
    })
    return mails.length;
  }
  return mails
}