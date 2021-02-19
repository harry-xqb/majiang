/**
 *
 * @author  Ta_Mu
 * @date 2021/2/9 9:45
 */
const BusinessError = require('../response/business-error')
const UserDao = require('../dao/user-dao')
const { passwordMatch, passwordEncode } = require('../util/encrypt-util')
const { createUUID } = require('../util/common-util')
const redis = require('../db/redis')
const { socketStore } = require('../socket/socket-store')
const SOCKET_USERS = 'SOCKET_USERS'
const SOCKET_USER_STATUS = {
  ONLINE: 0, // 在大厅
  IN_GAME: 1, // 游戏中
  IN_ROOM: 2, // 在房间
  OFFLINE: 3, // 离线
}
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
// 获取socket中的用户
const getSocketUserList = async (user) => {
  const socketUsers = await redis.hashGetAll(SOCKET_USERS)
  const userIds = []
  const userSocketMap = {}
  // 获取当前在线用户的socket信息
  Object.keys(socketUsers || {}).forEach(id => {
    // 在socket中，并且有状态记录的为在线用户
    if(Object.keys(socketStore).includes(id)) {
      userIds.push(id)
      userSocketMap[id] = JSON.parse(socketUsers[id])
    }
  })
  // 获取所有在线用户的信息
  if(!userIds.includes(user.id)) {
    userIds.push(user.id)
  }
  const userList = await UserDao.getByIds(userIds)
  const socketUserList = []
  // 拼装两个信息
  userList.forEach(user => {
    socketUserList.push({user, socketData: userSocketMap[user.id]})
  })
  const onLineSocketUserList = socketUserList.filter(item => item.user.id !== user.id)
  const currentSocketUser = socketUserList.find(item => item.user.id === user.id)
  const offLineUserList = await UserDao.getByNotInIds(userIds)
  const offLineSocketUserList = offLineUserList.map(user => ({user, socketData: {status: SOCKET_USER_STATUS.OFFLINE}}))
  return {
    onLineSocketUserList,
    currentSocketUser,
    offLineSocketUserList
  }
}
// 更新socket中用户状态信息
const updateSocketUser = async (user, data) => {
  const userId = user.id
  redis.hashSet(SOCKET_USERS, userId, JSON.stringify(data))
}
// 获取用户的socket信息
const getSocketData = async (user) => {
  const userId = user.id
  return await redis.hashGet(SOCKET_USERS, userId)
}
// 清除socket信息
const deleteSocketData = async (user) => {
  await redis.hashDel(SOCKET_USERS, user.id)
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
  createUser,
  getSocketUserList,
  updateSocketUser,
  getSocketData,
  deleteSocketData,
  SOCKET_USER_STATUS
}
