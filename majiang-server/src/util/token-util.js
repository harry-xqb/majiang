/**
 * token工具类
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const RedisUtil = require('../db/redis')
const TOKEN_PREFIX = 'TOKEN:'

// 生成token,并设置cookie
const generateToken = (user) => {
  const token = createUUID()
  const expireSeconds = 60 * 60 * 24 // 一天过期
  RedisUtil.set(TOKEN_PREFIX + token, user, expireSeconds)
  const date = new Date()
  date.setTime(date.getTime() + 1000 * expireSeconds)
  return token
}

// 获取token
const getUserByToken = (token) => {
  return RedisUtil.get(TOKEN_PREFIX + token)
}
// 删除token
const deleteToken = (token) => {
  return RedisUtil.del(TOKEN_PREFIX + token)
}

const TokenUtil = {
  generateToken,
  getUserByToken,
  deleteToken
}

module.exports = TokenUtil
