// 云函数入口文件
const cloud = require('wx-server-sdk')
const mailClient = require('node-mail-client')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { to, subject, html, account,text='' } = event
  const { addr:user, pass, imap, smtp,name } = account
  try {
    let email = new mailClient({
      user, pass, imap, smtp,name
    })
    email.check = 1
    email.send({
      to, subject, text, html
    })
  } catch (error) {
    return error
  }
  return 'success'
}