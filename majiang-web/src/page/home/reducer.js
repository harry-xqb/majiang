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
}
const INIT_USER_TYPE = 'INIT_USER_TYPE'
const SET_SOCKET_USER_TYPE = 'SET_SOCKET_USER_TYPE'

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

export const reducer = (state = initState, action) => {
  switch (action.type) {
    case INIT_USER_TYPE: return {...state, authenticated: action.authenticated, user: action.user}
    case SET_SOCKET_USER_TYPE: return {
      ...state,
      onLineSocketUserList: action.onLineSocketUserList,
      offLineSocketUserList: action.offLineSocketUserList,
      currentSocketUser: action.currentSocketUser,
    }
    default: return state
  }
}

