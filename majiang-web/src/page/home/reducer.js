/**
 *
 * @author  Ta_Mu
 * @date 2021/2/19 9:55
 */
export const initState = {
  authenticated: false,
  user: undefined,
  onLineSocketUserList: [],
  offLineSocketUserList: [],
  currentSocketUser: {},
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

export const initUserAction = (user, authenticated = true) => {
  return {
    type: INIT_USER_TYPE,
    user,
    authenticated
  }
}
export const setSocketUserListAction = (onLineSocketUserList, offLineSocketUserList, currentSocketUser) => {
  return {
    type: SET_SOCKET_USER_TYPE,
    onLineSocketUserList,
    offLineSocketUserList,
    currentSocketUser
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
    case INIT_USER_TYPE: return {...state, authenticated: action.authenticated, user: action.user}
    case SET_SOCKET_USER_TYPE: return {
      ...state,
      onLineSocketUserList: action.onLineSocketUserList,
      offLineSocketUserList: action.offLineSocketUserList,
      currentSocketUser: action.currentSocketUser,
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
        ...action.room,
        roomUserList: action.roomUserList,
      }
    }
    default: return state
  }
}

