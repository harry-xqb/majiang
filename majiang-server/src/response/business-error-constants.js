/**
 * 业务错误枚举
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */

const USER_NOT_LOGIN = {
  code: 401,
  msg: '用户未登陆'
}
const SYSTEM_ERROR = {
  code: 500,
  msg: '系统开小差了'
}

const ROOM_NOT_EXIST = {
  code: 404,
  msg: '房间号不存在'
}

module.exports = {
  USER_NOT_LOGIN,
  SYSTEM_ERROR,
  ROOM_NOT_EXIST
}
