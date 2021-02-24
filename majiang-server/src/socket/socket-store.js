/**
 *
 * @author  Ta_Mu
 * @date 2021/2/7 18:00
 */
const ResponseModel = require("../response/response-model");
// 存储房间连接, 房间号-> {userId => socket}
let socketStore = new Map()

const SOCKET_MESSAGE_TYPE = {
  ROOM_CHAT: {
    code: 1000,
    name: '房间->聊天消息'
  },
  ROOM_AUDIO: {
    code: 1001,
    name: '房间->语音消息'
  },
  ROOM_PLAY: {
    code: 1002,
    name: '房间->出牌'
  },
  ROOM_USER_STATUS_CHANGE: {
    code: 1003,
    name: '房间->用户状态改变'
  },
  ROOM_USER_JOIN: {
    code: 1004,
    name: '房间->用户加入房间'
  },
  ROOM_USER_EXIT: {
    code: 1005,
    name: '房间->用户退出房间'
  },
  ROOM_DISBAND: {
    code: 1006,
    name: '房间->解散房间'
  },
  ROOM_CHANGE_HOST: {
    code: 1007,
    name: '房间->改变房主'
  },
  ROOM_GAME_START: {
    code: 1010,
    name: '房间->游戏开始'
  },
  SYSTEM_CONNECT: {
    code: 2001,
    name: '系统消息->连接成功'
  },
  SYSTEM_CROWDED_OFFLINE: {
    code: 2002,
    name: '系统消息->被挤下线'
  },
  SYSTEM_DISCONNECT: {
    code: 2003,
    name: '系统消息->掉线'
  },
  SYSTEM_USER_STATUS_CHANGE: {
    code: 2004,
    name: '系统消息->在线用户状态改变'
  },
  SYSTEM_USER_LIST_STATUS_CHANGE: {
    code: 2005,
    name: '系统消息->批量在线用户状态改变'
  },
  SYSTEM_USER_ROOM_INVITE: {
    code: 2006,
    name: '系统消息->邀请加入游戏'
  }
}

/**
 * 通过websocket发送消息
 * @param userList 要发送的用户列表
 * @param messageType 消息类型
 * @param responseData 响应数据
 */
const sendMessage = (userList, messageType, responseData) => {
  userList.forEach(userId => {
    if(socketStore[userId]) {
      socketStore[userId].send(JSON.stringify(ResponseModel.ofSuccess({messageType, responseData})))
    }
  })
}
/**
 * 给所有在线用户发送信息
 * @param messageType 消息类型
 * @param responseData 响应数据
 */
const sendMessageToAll = (messageType, responseData) => {
  const allOnlineUserList = Object.keys(socketStore)
  sendMessage(allOnlineUserList, messageType, responseData)
}

module.exports = {
  socketStore,
  sendMessage,
  sendMessageToAll,
  SOCKET_MESSAGE_TYPE
}
