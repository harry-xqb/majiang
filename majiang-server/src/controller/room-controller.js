/**
 * 房间相关路由
 * @author  Ta_Mu
 * @date 2021/2/9 9:20
 */
const router = require('koa-router')()
const authenticationFilter = require('../filter/authentication-filter')
const RoomService = require('../service/room-service')
router.prefix('/room')
/**
 * 创建房间并进入
 */
router.post('/create', authenticationFilter, async (ctx, next) => {
  const user = ctx.session;
  ctx.body = await RoomService.createRoom(user.id)
})

module.exports = router
