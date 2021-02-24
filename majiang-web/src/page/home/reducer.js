/**
 *
 * @author  Ta_Mu
 * @date 2021/2/19 9:55
 */
export const initState = {
  authenticated: false,
  user: {},
  socketData: {},
  onLineSocketUserList: [],
  offLineSocketUserList: [],
  room: {
    roomInfo: {},
    roomUserList: [],
    roomNumber: null
  }
}
const INIT_USER_TYPE = 'INIT_USER_TYPE'
const SET_SOCKET_USER_TYPE = 'SET_SOCKET_USER_TYPE'
const SET_ROOM_DATA_TYPE = 'SET_ROOM_DATA_TYPE'
const SET_ROOM_DATA_USER_LIST_TYPE = 'SET_ROOM_DATA_USER_LIST_TYPE'

export const initUserAction = ({user, socketData}, authenticated = true) => {
  return {
    type: INIT_USER_TYPE,
    user,
    socketData,
    authenticated
  }
}
export const setSocketUserListAction = (onLineSocketUserList, offLineSocketUserList) => {
  return {
    type: SET_SOCKET_USER_TYPE,
    onLineSocketUserList,
    offLineSocketUserList,
  }
}
export const setRoomDataAction = (roomNumber, roomInfo, roomUserList) => {
  return {
    type: SET_ROOM_DATA_TYPE,
    roomNumber,
    roomInfo,
    roomUserList
  }
}
export const setRoomDataUserList = (roomUserList) => {
  return {
    type: SET_ROOM_DATA_USER_LIST_TYPE,
    roomUserList
  }
}

export const reducer = (state = initState, action) => {
  switch (action.type) {
    case INIT_USER_TYPE: return {...state, authenticated: action.authenticated, user: action.user, socketData: action.socketData}
    case SET_SOCKET_USER_TYPE: return {
      ...state,
      onLineSocketUserList: action.onLineSocketUserList,
      offLineSocketUserList: action.offLineSocketUserList,
    }
    case SET_ROOM_DATA_TYPE: return {
      ...state,
      room: {
        roomNumber: action.roomNumber,
        roomInfo: action.roomInfo,
        roomUserList: action.roomUserList,
      }
    }
    case SET_ROOM_DATA_USER_LIST_TYPE: return {
      ...state,
      room: {
        ...state.room,
        roomUserList: action.roomUserList,
      }
    }
    default: return state
  }
}

