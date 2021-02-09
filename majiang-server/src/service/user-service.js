/**
 *
 * @author  Ta_Mu
 * @date 2021/2/9 9:45
 */
const BusinessError = require('../response/business-error')
const UserDao = require('../dao/user-dao')
const { passwordMatch, passwordEncode } = require('../util/encrypt-util')
const { createUUID } = require('../util/common-util')

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 */
const login = async (username, password) => {
  const user = await UserDao.getByUsername(username);
  if(!user || !passwordMatch(password, user.password)) {
    throw new BusinessError('用户名或密码错误')
  }
  delete user.password
  return user;
}

const createUser = async (user) => {
  const { password, username } = user;
  if(await UserDao.getByUsername(username)) {
    throw new BusinessError('用户已存在')
  }
  if(user.phone && await UserDao.getByPhone(user.phone)) {
    throw new BusinessError('手机号已注册')
  }
  const uuid = createUUID()
  const createdUser = {...user, id: uuid, password: passwordEncode(password)}
  await UserDao.createUser(createdUser);
  return {...createdUser, password: undefined}
}
/**
 * 通过id获取用户
 * @param id 用户id
 */
const getById = async (id) => {
  return UserDao.getById(id)
}

module.exports = {
  login,
  getById,
  createUser
}
