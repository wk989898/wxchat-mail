const cloud = require('wx-server-sdk')
const mailClient = require('node-mail-client')

// 初始化 cloud
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  const { addr, pass, server, port1, port2, name } = event
  const imap = ['imap.' + server, port1]
  const smtp = ['smtp.' + server, port2]
  let temp = { name, addr, pass, server, imap, smtp }
  var mails = [temp], client
  client = new mailClient({ name, user: addr, pass, imap, smtp })

  return await client.receive(null).then(async res => {

    await db.collection('user').doc(openid).get()
      .then(async res => {
        mails = res.data.mails.filter(v => v.addr !== mails[0].addr).concat(mails)
        await db.collection('user').doc(openid).update({
          data: {
            mails
          }
        })
      }, async err => {
        console.log('add new user...');
        await db.collection('user').add({
          data: {
            _id: openid,
            mails
          }
        })
      })

  }).catch(e => e.message)
}

