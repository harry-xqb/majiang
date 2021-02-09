const router = require('koa-router')()
const socketStore = require('../store/socket-store')
const TokenUtil = require('../util/token-util')
const { USER_NOT_LOGIN } = require("../response/business-error-constants");
const BusinessError = require('../response/business-error')
const {socketExceptionFilter} = require("../filter/exception-filter");

router.all('/home/:tokenId', socketExceptionFilter, async (ctx) => {
  const tokenId = ctx.params.tokenId
  const user = await TokenUtil.getUserByToken(tokenId)
  if(user == null) {
    throw new BusinessError(USER_NOT_LOGIN)
  }
  const userId = user.id
  /*const roomId = ctx.params.roomId
  // 如果房间id不存在，则创建该房间id,并赋值一个对象
  const roomKey = ROOM_PREFIX + roomId
  roomSockets[roomKey] = roomSockets[roomKey] || {}
  // 初始化当前房间id的用户列表
  roomSockets[roomKey]['users'] = roomSockets[roomKey]['users'] || []
  // 如果当前用户不在列表中，则添加
  if(roomSockets[roomKey]['users'].indexOf(userId) === -1) {
    roomSockets[roomKey]['users'].push(userId)
  }
  // 将socket信息存入集合中。并以用户id对应
  roomSockets[roomKey]['socketMap'] = roomSockets[roomKey]['socketMap'] || {}
  roomSockets[roomKey]['socketMap'][USER_SOCKET_PREFIX + userId] = ctx.websocket*/
  socketStore[userId] = ctx.websocket
  const msg = '连接成功， 用户id:' + userId  + "当前在线人数:" + Object.keys(socketStore).length
  ctx.websocket.send(msg);
  ctx.websocket.on('message', function(message) {
    // 接收到消息处理
    ctx.websocket.send('回复:' + message);
  });
  ctx.websocket.on('close', (code, reason) => {
    delete socketStore[userId]
    console.log('断开连接->code:', code, '; reason:', reason)
  })
})

module.exports = router
