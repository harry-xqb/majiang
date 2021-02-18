const router = require('koa-router')()
const { socketStore } = require('./socket-store')
const TokenUtil = require('../util/token-util')
const { USER_NOT_LOGIN } = require("../response/business-error-constants");
const BusinessError = require('../response/business-error')
const {socketExceptionFilter} = require("../filter/exception-filter");
const { sendMessage, SOCKET_MESSAGE_TYPE } = require("./socket-store");

const CLOSE_SOCKET_CODE = 3001

router.all('/home/:tokenId', socketExceptionFilter, async (ctx) => {
  const tokenId = ctx.params.tokenId
  const userStr = await TokenUtil.getUserByToken(tokenId)
  if(userStr == null) {
    throw new BusinessError(USER_NOT_LOGIN)
  }
  const user = JSON.parse(userStr)
  const userId = user.id
  // 如果当前用户链接已经存在， 则断开该链接
  if(socketStore[userId]) {
    const socket = socketStore[userId]
    sendMessage([userId], SOCKET_MESSAGE_TYPE.SYSTEM_CROWDED_OFFLINE)
    socket.close(CLOSE_SOCKET_CODE, '服务端主动关闭')
  }
  socketStore[userId] = ctx.websocket
  sendMessage([userId], SOCKET_MESSAGE_TYPE.SYSTEM_CONNECT, {user, onlineNumber: Object.keys(socketStore).length})
  ctx.websocket.on('message', function(message) {
    // 接收到消息处理
    ctx.websocket.send('回复:' + message);
  });
  ctx.websocket.on('close', (code, reason) => {
    if(code !== CLOSE_SOCKET_CODE) {
      delete socketStore[userId]
    }
    console.log('断开连接->code:', code, '; reason:', reason)
  })
})

module.exports = router
