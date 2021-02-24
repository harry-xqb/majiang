/**
 *
 * @author  Ta_Mu
 * @date 2021/2/24 16:05
 */
import {USER_PREPARE_STATUS} from "../common";
import {setRoomDataAction, setRoomDataUserList} from "../reducer";
import {message} from "antd";

const roomSocketHandler = (messageCode, responseData, state, dispatch, history) => {
  const room = state.room
  if(messageCode === 1003) {  // 用户状态改变
    const roomUserList = room.roomUserList.map(item => {
      if(item.id === responseData.user.id) {
        item.roomData = {...item.roomData, status: responseData.status}
      }
      return item
    })
    dispatch(setRoomDataUserList(roomUserList))
    return
  }
  if(messageCode === 1004) {  // 用户加入房间
    message.info(`用户(${responseData.username})加入房间`)
    const roomUserList = [...room.roomUserList, {...responseData, roomData: {status: USER_PREPARE_STATUS.UNREADY}}]
    dispatch(setRoomDataUserList(roomUserList))
    return
  }
  if(messageCode === 1005) { // 用户退出房间
    message.warn(`用户(${responseData.user.username})退出了房间`)
    let roomUserList = room.roomUserList.filter(item => item.id !== responseData.user.id)
    // 是否设置新的房主
    if(responseData.hostId) {
      let msg = '您'
      // 如果当前用户不等于新房主，则消息房主的用户名
      if(state.user.id !== responseData.hostId) {
        msg = '用户' + (room.roomUserList.find(item => item.id === responseData.hostId)?.username || responseData.hostId)
      }
      msg += '已成为房主'
      // 修改当前用户状态为已准备
      roomUserList = roomUserList.map(item => {
        if(item.id === responseData.hostId) {
          item.roomData = {status: USER_PREPARE_STATUS.READY}
        }
        return item
      })
      message.info(msg)
    }
    dispatch(setRoomDataAction(room.roomNumber, {...room.roomInfo, hostId: responseData.hostId || room.roomInfo.hostId}, roomUserList))
    return;
  }
  if(messageCode === 1006) { // 解散房间
    message.warn(`房间已被解散`)
    dispatch(setRoomDataAction(null, {}, []))
    history.push('/home/lobby')
    return;
  }
}

export default roomSocketHandler
