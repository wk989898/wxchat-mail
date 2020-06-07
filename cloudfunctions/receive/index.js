// 云函数入口文件
const cloud = require('wx-server-sdk')
const mailClient = require('node-mail-client')
var moment = require('moment')
moment.locale('zh-cn')

cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  const { account, num, type } = event
  const { name, addr: user, pass, imap, smtp } = account
  const client = new mailClient({ name, user, pass, imap, smtp })
  client.check = 1
  return await client.receive(total => {
    if (type === 'down') {
      // load more
      return `${num - 5}:${num-1}`
    } else if (type === 'up') {
      // pull refresh
      const t = total - num
      if (t > 0) return `${num}:*`
      return '0:0'
    }
    return `${total - num + 1}:*`
  }).then(result => {
    return result.reverse().map(v => {
      const [name, from] = v.header.from[0].replace(/\>$/, '').split(' <')
      const time = moment(v.attrs.date).calendar(null, {
        lastDay: '[昨天] LT',
        sameDay: 'LT',
        nextDay: '[明天] LT',
        lastWeek: 'dddd LT',
        nextWeek: 'dddd LT',
        sameElse: 'L'
      })
      return {
        name,
        from,
        time,
        flags:v.attrs.flags,
        body: v.body,
        subject: v.header.subject[0],
        to: v.header.to[0].replace(/^[\s\S]*\<|\>$/g, ''),
        star: false,
        seqno: v.seqno
      }
    })
  }).catch(e => null)
}