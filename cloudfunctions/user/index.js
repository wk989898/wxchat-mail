// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
/**
 * @returns {number} 1 注册用户    2 未注册用户
 */
exports.main = async (event, context) => {

  const openid = cloud.getWXContext().OPENID
  /**_id 每个用户独一无二的 openid */
  return await db.collection('user').where({
    _id: openid,
  }).get().then(async (res) => {
    const mails = res.data[0].mails||[]
    if (mails.length>0) return 1
    return 2
  })
}