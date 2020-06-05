// 云函数入口文件
const cloud = require('wx-server-sdk')
const mailClient = require('node-mail-client')

cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  const { account, num, type } = event
  const { name, addr: user, pass, imap, smtp } = account
  const client = new mailClient({ name, user, pass, imap, smtp })
  client.check = 1
  function format(date) {
    var now = new Date(date)
    var a = '/'
    return now.getFullYear().toString() + a +
      now.getMonth().toString().padStart(2, '0') + a +
      now.getDay().toString().padStart(2, '0')
  }
  return await client.receive(total => {
    if (type === 'down') {
      // load more
      return `${num - 4}:${num}`
    } else if (type === 'up') {
      // pull refresh
      const t = total - num
      if (t > 0) return `${num}:*`
      return '0:0'
    }
    return `${total - num + 1}:*`
  }).then(result => {
    return result.reverse().map(v => {
      const [name,from]=v.header.from[0].replace(/\>$/,'').split(' <')
      return {
        name,
        from,
        body: v.body,
        subject: v.header.subject[0],
        to: v.header.to[0].replace(/^[\s\S]*\<|\>$/g,''),
        time: format(v.attrs.date),
        star: false,
        seqno: v.seqno
      }
    })
  }).catch(e=>null)
}