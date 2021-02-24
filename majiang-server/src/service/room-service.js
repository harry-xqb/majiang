/**
 * 房间服务
 * @author  Ta_Mu
 * @date 2021/2/7 16:50
 */
const { createUUID, randomNumberStr } = require('../util/common-util')
const RoomDao = require('../dao/room-dao')
const redis = require('../db/redis')
const BusinessError = require('../response/business-error')
const {ROOM_NOT_EXIST} = require("../response/business-error-constants");
const {getSocketData} = require("./user-service");
const {SOCKET_USER_STATUS, updateSocketUser, getByIds} = require("./user-service");
const { sendMessage, SOCKET_MESSAGE_TYPE, sendMessageToAll } = require('../socket/socket-store')

const ROOMS_KEY = 'ROOMS'
const ROOM_KEY_TYPE = {
  USERS: 'USERS',
  INFO: 'INFO',
  USER_HASH: 'USER_HASH',
  CARDS: 'CARDS',
  CURRENT_USER: 'CURRENT_USER',
}
const ROOM_STATUS = {
  CREATED: 0,
  PROGRESS: 1,
  FINISH: 2,
}
// 用户状态
const USER_STATUS = {
  UNREADY: 0, // 未准备
  READY: 1, // 已准备
}
// 游戏所需人数
const GAME_USER_NUMBER = 4

// ROOMS => [room_number]  当前所有开放的房间号, SORTED SET 按照
// ROOM:XXX:USERS => [userId, userId, userId]  当前房间用户 list
// ROOM:XXX:INFO => {status: 房间状态: 0: 未开始 1:进行中 2:已结束, hostId: xx}
// ROOM:XXX:USER_HASH => {userId: {status: '', handCard: []}, userId: {}} 用户状态
// ROOM:XXX:CARDS => [] 剩余牌 list

// 游戏开始时或用户出牌时，如果用户未出牌则，定时30秒后给当前用户自动出牌（最后一张手牌），并进入下一个定时
/**
 * 创建房间
 * @param user 用户
 */
const createRoom = async (user) => {
  const userId = user.id
  const id = createUUID()
  // 判断用户是否已经存在与房间或游戏中
  await userSocketStatusCheck(user)
  const roomNumber = await generateRoomNumber()
  const room = {id, roomNumber, hostId: userId, status: ROOM_STATUS.CREATED}
  await RoomDao.createRoom(room)
  // 往redis中添加该房间号
  redis.sortedSetAdd(ROOMS_KEY, roomNumber, new Date().getTime())
  // 设置当前房间信息
  redis.set(generateRoomKey(ROOM_KEY_TYPE.INFO, roomNumber), {status: ROOM_STATUS.CREATED, hostId: userId})
  // 添加当前房主到房间用户列表
  redis.listPush(generateRoomKey(ROOM_KEY_TYPE.USERS, roomNumber), userId)
  // 设置当前用户房间状态为已准备
  redis.hashSet(generateRoomKey(ROOM_KEY_TYPE.USER_HASH, roomNumber), userId, JSON.stringify({status: USER_STATUS.READY}))
  // 设置当前用户的状态
  updateSocketUser(userId, {status: SOCKET_USER_STATUS.IN_ROOM, roomNumber})
  // 向所有在线用户发送当前用户的状态
  sendMessageToAll(SOCKET_MESSAGE_TYPE.SYSTEM_USER_STATUS_CHANGE, {status: SOCKET_USER_STATUS.IN_ROOM, userId})
  return room
}
/**
 * 加入房间
 * @param user 用户
 * @param roomNumber 房间号
 * @returns {Promise<void>}
 */
const joinRoom = async (user, roomNumber) => {
  const userId = user.id
  await userSocketStatusCheck(user)
  await roomExistCheck(roomNumber)
  const userIdList = await redis.listRange(generateRoomKey(ROOM_KEY_TYPE.USERS, roomNumber))
  if(userIdList.length >= GAME_USER_NUMBER) {
    throw new BusinessError('房间人数已满')
  }
  if(userIdList.includes(userId)) {
    throw new BusinessError('您已在房间中')
  }
  // 添加当前用户到房间用户列表
  redis.listPush(generateRoomKey(ROOM_KEY_TYPE.USERS, roomNumber), userId)
  // 设置当前用户的状态
  updateSocketUser(userId, {status: SOCKET_USER_STATUS.IN_ROOM, roomNumber})
  // 设置当前用户状态为未准备
  redis.hashSet(generateRoomKey(ROOM_KEY_TYPE.USER_HASH, roomNumber), userId, JSON.stringify({status: USER_STATUS.UNREADY}))
  sendMessage(userIdList, SOCKET_MESSAGE_TYPE.ROOM_USER_JOIN, user )
  sendMessageToAll(SOCKET_MESSAGE_TYPE.SYSTEM_USER_STATUS_CHANGE, {status: SOCKET_USER_STATUS.IN_ROOM, userId})
}

/**
 * 退出房间
 * @param user 用户
 * @param roomNumber 房间号
 */
const exitRoom = async (user, roomNumber) => {
  const userId = user.id
  await userSocketStatusCheck(user, SOCKET_USER_STATUS.IN_ROOM)
  await roomExistCheck(roomNumber)
  redis.listRemove(generateRoomKey(ROOM_KEY_TYPE.USERS, roomNumber), userId)
  redis.hashDel(generateRoomKey(ROOM_KEY_TYPE.USER_HASH, roomNumber), userId)
  // 设置当前用户的状态
  updateSocketUser(userId, {status: SOCKET_USER_STATUS.ONLINE})
  const userIdList = await redis.listRange(generateRoomKey(ROOM_KEY_TYPE.USERS, roomNumber))
  // 通知所有用户当前用户状态为在线
  sendMessageToAll(SOCKET_MESSAGE_TYPE.SYSTEM_USER_STATUS_CHANGE, {status: SOCKET_USER_STATUS.ONLINE, userId})
  // 如果房间没人了， 则删除该房间的信息
  if(userIdList.length === 0) {
    deleteRedisRoomInfo()
    return
  }
  // 如果当前退出的用户是房主，则设置剩下用户中的第一位为房主
  const roomInfoStr =  await redis.get(generateRoomKey(ROOM_KEY_TYPE.INFO, roomNumber))
  const hostId = roomInfoStr ? JSON.parse(roomInfoStr).hostId : null
  if(hostId === userId) {
    const newHostId = userIdList[0]
    // 设置新房主用户状态为已准备
    redis.hashSet(generateRoomKey(ROOM_KEY_TYPE.USER_HASH, roomNumber), newHostId, JSON.stringify({status: USER_STATUS.READY}))
    // 设置当前房间的新房主
    redis.set(generateRoomKey(ROOM_KEY_TYPE.INFO, roomNumber), {status: ROOM_STATUS.CREATED, hostId: newHostId})
    sendMessage(userIdList, SOCKET_MESSAGE_TYPE.ROOM_USER_EXIT, {user, hostId: newHostId})
    return
  }
  sendMessage(userIdList, SOCKET_MESSAGE_TYPE.ROOM_USER_EXIT, {user})
}
/**
 * 改变房间用户状态
 * @param user 用户
 * @param roomNumber 房间号
 * @param status 用户状态  0：未准备 1: 已准备
 */
const changeUserStatus = async (user, roomNumber, status) => {
  const userId = user.id
  await roomExistCheck(roomNumber)
  // 设置当前用户状态
  redis.hashSet(generateRoomKey(ROOM_KEY_TYPE.USER_HASH, roomNumber), userId, JSON.stringify({status: status}))
  const userIdList = await redis.listRange(generateRoomKey(ROOM_KEY_TYPE.USERS, roomNumber))
  sendMessage(userIdList, SOCKET_MESSAGE_TYPE.ROOM_USER_STATUS_CHANGE, { user, status })
}

/**
 * 解散房间
 * @param user 用户
 * @param roomNumber 房间号
 */
const disbandRoom = async (user, roomNumber) => {
  await roomExistCheck(roomNumber)
  const userIdList = await redis.listRange(generateRoomKey(ROOM_KEY_TYPE.USERS, roomNumber))
  // 设置当前房间信息
  const roomInfoStr = await redis.get(generateRoomKey(ROOM_KEY_TYPE.INFO, roomNumber))
  if(roomInfoStr) {
    const roomInfo = JSON.parse(roomInfoStr)
    // 只有房主才能解散房间
    if(roomInfo.hostId !== user.id) {
      throw new BusinessError('无权解散该房间')
    }
    // 解散房间, 删除所有该房间开头的key前缀: room:roomId:*
    deleteRedisRoomInfo(roomNumber)
    userIdList.forEach(id => {
      updateSocketUser(id, {status: SOCKET_USER_STATUS.ONLINE})
    })
    sendMessage(userIdList, SOCKET_MESSAGE_TYPE.ROOM_DISBAND )
    sendMessageToAll(SOCKET_MESSAGE_TYPE.SYSTEM_USER_LIST_STATUS_CHANGE, {status: SOCKET_USER_STATUS.ONLINE, userIdList})
  }
}
/**
 * 删除房间信息
 * @param roomNumber 房间号
 */
const deleteRedisRoomInfo = (roomNumber) => {
  redis.del(generateRoomKey(ROOM_KEY_TYPE.INFO, roomNumber))
  redis.del(generateRoomKey(ROOM_KEY_TYPE.USERS, roomNumber))
  redis.del(generateRoomKey(ROOM_KEY_TYPE.USER_HASH, roomNumber))
  // 往redis中添加移除该房间号
  redis.sortedSetDelete(ROOMS_KEY, roomNumber)
}

/**
 * 开始游戏
 * @param user 用户
 * @param roomNumber 房间号
 */
const startGame = async (user, roomNumber) => {
  const userId = user.id
  await roomExistCheck(roomNumber)
  const userIdList = redis.listRange(generateRoomKey(ROOM_KEY_TYPE.USERS, roomNumber))
  if(userIdList.length < GAME_USER_NUMBER) {
    throw new BusinessError('游戏人数不足')
  }
  const userHash = await redis.hashGetAll(generateRoomKey(ROOM_KEY_TYPE.USER_HASH, roomNumber))
  userIdList.forEach(userId => {
    const userHashInfo = JSON.parse(userHash[userId])
    if(userHashInfo.status === 0) {
      throw new BusinessError('有玩家还未准备')
    }
  })
  // 开始游戏。分别给各个玩家发牌
  sendMessage(userIdList, SOCKET_MESSAGE_TYPE.ROOM_GAME_START)
}

/**
 * 获取房间信息
 * @param roomNumber 房间号
 */
const getRoomInfo = async (roomNumber, user) => {
  await roomExistCheck(roomNumber)
  const userId = user.id
  const roomInfoStr = await redis.get(generateRoomKey(ROOM_KEY_TYPE.INFO, roomNumber))
  let roomInfo = roomInfoStr ? JSON.parse(roomInfoStr) : {}
  let roomUserIdList = await redis.listRange(generateRoomKey(ROOM_KEY_TYPE.USERS, roomNumber))
  roomUserIdList = roomUserIdList.filter(id => id !== userId)
  roomUserIdList.unshift(userId)
  const userList = await getByIds(roomUserIdList)
  const userMap = {}
  userList.forEach(item => userMap[item.id] = item)
  const userRoomHash = await redis.hashGetAll(generateRoomKey(ROOM_KEY_TYPE.USER_HASH, roomNumber))
  const roomUserList = roomUserIdList.map(id => {
    const dataStr = userRoomHash[id]
    const userInfo = userMap[id] || {}
    let roomData = dataStr ? JSON.parse(dataStr) : {}
    return {
      ...userInfo,
      roomData
    }
  })
  return {
    roomInfo,
    roomUserList
  }
}
/**
 * 要求用户到房间
 * @param user 当前用户
 * @param roomNumber 房间号
 * @param inviteUserId 邀请的用户id
 */
const inviteUser = async (user, roomNumber, inviteUserId) => {
  // 检查当前用户是否在房间中
  await userSocketStatusCheck(user, SOCKET_USER_STATUS.IN_ROOM)
  // 检查房间是否存在
  await roomExistCheck(roomNumber)
  sendMessage([inviteUserId], SOCKET_MESSAGE_TYPE.SYSTEM_USER_ROOM_INVITE, {roomNumber, user})
}

const userSocketStatusCheck = async (user, status = SOCKET_USER_STATUS.ONLINE) => {
  const data = await getSocketData(user)
  if(data && data.status !== status) {
    throw new BusinessError('用户状态异常')
  }
}
const roomExistCheck = async (roomNumber) => {
  if(!await redis.sortedSetExist(ROOMS_KEY, roomNumber)) {
    throw BusinessError.ofStatus(ROOM_NOT_EXIST)
  }
}
// 生成房间号
const generateRoomNumber = async () => {
  const roomNumber = randomNumberStr(6)
  // 如果当前房间号已经存在，则重新随机生成一个房间号
  if(await redis.sortedSetExist(ROOMS_KEY, roomNumber)) {
     await generateRoomNumber()
  }
  return roomNumber
}

// 生成房间的redis key
const generateRoomKey = (type, roomNumber) => {
  const key = 'ROOM:' + roomNumber + ':'
  return key + type
}


module.exports = {
  createRoom,
  exitRoom,
  changeUserStatus,
  joinRoom,
  disbandRoom,
  getRoomInfo,
  inviteUser
}
