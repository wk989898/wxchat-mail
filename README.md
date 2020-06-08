# Mail
期末作业(即将完成)

## 介绍
仿 gmail app 的小程序   
纯原生小程序，css功底有点差😅， 欢迎`star`/`fork`

待做 :
- loading display
- ......
- 小程序上线 🤔

## 注意
- 有些功能未实现（备注有说明）
   - 搜索
   - 滑动查看上/下一封邮件
   - 滑动打开侧边栏
   - 删除/星标/归档 邮件
   - 查看所有邮件
- 下拉加载会有卡顿
- towxml解析（暂时没找到办法~~欢迎提供建议）
   - 网页内容不能全屏显示[#145](https://github.com/sbfkcel/towxml/issues/145)
   - ~~纯文本解析换行问题~~
- ~~base64内容无法显示~~(貌似已经解决)

## 备注
感谢[@sbfkcel](https://github.com/sbfkcel) 提供的 [towxml](https://github.com/sbfkcel/towxml) html渲染  

收发邮件将`imap`和`smtp`加以整合,实现了基本需求，如果有需要更多设置，可以fork [node-mail-client](https://github.com/wk989898/mail) 项目加以更改  

考虑到邮箱文件大小，故没有将邮件保存到数据库，每次启动都会拉取邮件，更换邮箱时会重新拉取。为了减少逻辑复杂度（偷懒），所有邮箱和主要邮箱一致，`星标`/`删除`邮件只在本地生效
