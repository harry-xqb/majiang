const router = require('koa-router')()
const ResponseModel = require('../response/response-model')
const UserService = require('../service/user-service')
const BusinessError = require('../response/business-error')
const TokenUtil = require('../util/token-util')
const authenticationFilter = require('../filter/authentication-filter')

router.prefix('/user')
router.post('/login',  async (ctx, next) => {
  const {username, password} = ctx.request.body;
  if(!username) {
    throw new BusinessError('用户名为空')
  }
  if(!password) {
    throw new BusinessError('密码为空')
  }
  const user = await UserService.login(username, password)
  const token = TokenUtil.generateToken(user)
  ctx.body = ResponseModel.ofSuccess({token})
});

router.get('/socketListInfo', authenticationFilter,async (ctx, next) => {
  const user = ctx.session
  ctx.body = ResponseModel.ofSuccess(await UserService.getSocketUserList(user))
})

/**
 * 获取当前登录用户信息
 */
router.get('/info', authenticationFilter, async (ctx, next) => {
  const socketData = await UserService.getSocketData(ctx.session)
  ctx.body = ResponseModel.ofSuccess({user: ctx.session, socketData});
})

/**
 * 创建用户
 */
router.post('/create', async (ctx, next) => {
  ctx.body = ResponseModel.ofSuccess(await UserService.createUser(ctx.request.body))
})

/**
 * 登出
 */
router.post('/logout', authenticationFilter, async (ctx, next) => {
  TokenUtil.deleteToken(ctx.token)
  ctx.body = ResponseModel.ofSuccess()
})

module.exports = router
