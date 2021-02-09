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

/**
 * 获取当前登录用户信息
 */
router.get('/info', authenticationFilter, async (ctx, next) => {
  ctx.body = ctx.session;
})

/**
 * 创建用户
 */
router.post('/create', async (ctx, next) => {
  ctx.body = await UserService.createUser(ctx.request.body)
})

module.exports = router
