/**
 * 房间服务
 * @author  Ta_Mu
 * @date 2021/2/7 16:50
 */
const { createUUID, randomNumberStr } = require('../util/common-util')
const RoomDao = require('../dao/room-dao')
const redis = require('../db/redis')
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

// ROOMS => [room_number]  当前所有开放的房间号, SORTED SET 按照
// ROOM:XXX:USERS => [userId, userId, userId]  当前房间用户 list
// ROOM:XXX:INFO => {status: 房间状态: 0: 未开始 1:进行中 2:已结束, hostId: xx}
// ROOM:XXX:USER_HASH => {userId: {status: '', handCard: []}, userId: {}} 用户状态
// ROOM:XXX:CARDS => [] 剩余牌 list

// 游戏开始时或用户出牌时，如果用户未出牌则，定时30秒后给当前用户自动出牌（最后一张手牌），并进入下一个定时
/**
 * 创建房间
 * @param userId 用户id
 */
const createRoom = async (userId) => {
  const id = createUUID()
  const roomNumber = await generateRoomNumber()
  const room = {id, roomNumber, hostId: userId, status: ROOM_STATUS.CREATED}
  await RoomDao.createRoom(room)
  // 往redis中添加该房间号
  redis.sortedSetAdd(ROOMS_KEY, roomNumber, new Date().getTime())
  // 设置当前房间信息
  redis.set(generateRoomKey(ROOM_KEY_TYPE.INFO, roomNumber), {status: ROOM_STATUS.CREATED, hostId: userId})
  // 添加当前房主到房间用户列表
  redis.listPush(generateRoomKey(ROOM_KEY_TYPE.USERS, roomNumber), [userId])
  // 设置当前用户状态为已准备
  redis.hashSet(generateRoomKey(ROOM_KEY_TYPE.USER_HASH, roomNumber), userId, JSON.stringify({status: USER_STATUS.READY}))
  return room
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
  createRoom
}
