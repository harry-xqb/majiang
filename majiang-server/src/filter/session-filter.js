/**
 * 解析请求头或请求参数中的token为session
 * @author  Ta_Mu
 * @date 2021/2/9 9:59
 */
const TokenUtil = require('../util/token-util')

// 解析session
const sessionFilter = async (ctx, next) => {
  let token = ctx.headers.token || ctx.query.token
  // 临时记录session数据
  let user = null
  if(token) {
    const resultUser = await TokenUtil.getUserByToken(token)
    if(resultUser) {
      user = JSON.parse(resultUser)
    }
  }
  ctx.session = user
  await next()
}

module.exports = sessionFilter
