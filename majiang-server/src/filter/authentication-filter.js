/**
 * 认证拦截器
 * @author  Ta_Mu
 * @date 2021/1/13 17:38
 */
const BusinessError = require('../response/business-error')
const { USER_NOT_LOGIN } = require('../response/business-error-constants')

const authenticationFilter = async (ctx, next) => {
  if(ctx.session) {
    return await next()
  }
  throw BusinessError.ofStatus(USER_NOT_LOGIN)
}

module.exports = authenticationFilter
