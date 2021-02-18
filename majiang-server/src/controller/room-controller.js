/**
 * 房间相关路由
 * @author  Ta_Mu
 * @date 2021/2/9 9:20
 */
const router = require('koa-router')()
const authenticationFilter = require('../filter/authentication-filter')
const RoomService = require('../service/room-service')
const ResponseModel = require('../response/response-model')

router.prefix('/room')
// 认证拦截
router.use( '/', authenticationFilter)
/**
 * 创建房间并进入
 */
router.post('/create', async (ctx, next) => {
  ctx.body = await RoomService.createRoom(ctx.session)
})

/**
 * 加入房间
 */
router.post('/join', async (ctx, next) => {
  const { roomNumber } = ctx.request.body;
  await RoomService.joinRoom(ctx.session, roomNumber)
  ctx.body = ResponseModel.ofSuccess()
})

/**
 * 退出房间
 */
router.post('/exit', async (ctx, next) => {
  const { roomNumber } = ctx.request.body;
  await RoomService.exitRoom(ctx.session, roomNumber)
  ctx.body = ResponseModel.ofSuccess()
})

/**
 * 改变用户状态
 */
router.post('/changeUserStatus', async (ctx, next) => {
  const { roomNumber, status } = ctx.request.body;
  await RoomService.changeUserStatus(ctx.session, roomNumber, status)
  ctx.body = ResponseModel.ofSuccess()
})

/**
 * 解散房间
 */
router.post('/disband', async (ctx, next) => {
  const { roomNumber } = ctx.request.body;
  await RoomService.disbandRoom(ctx.session, roomNumber)
  ctx.body = ResponseModel.ofSuccess()
})

/**
 * 开始游戏
 */
router.post('/game/start', async (ctx, next) => {
  const { roomNumber } = ctx.request.body;
  await RoomService.disbandRoom(ctx.session, roomNumber)
  ctx.body = ResponseModel.ofSuccess()
})


module.exports = router
