/**
 *
 * @author  Ta_Mu
 * @date 2021/2/19 16:38
 */
import {message} from "antd";
import {setSocketUserListAction} from "./reducer";

const socketHandler = (messageCode, responseData, state, dispatch) => {
  if(messageCode === 2001) { // 系统消息->连接成功
    message.info('用户（' + responseData.user.username + '）已上线')
    const offLineList = state.offLineSocketUserList.filter(item => item.user.id !== responseData.user.id)
    const onLineList = [...state.onLineSocketUserList.filter(item => item.user.id !== responseData.user.id), responseData]
    dispatch(setSocketUserListAction(onLineList, offLineList, state.currentSocketUser))
    return
  }
  if(messageCode === 2003) { // 系统消息->掉线
    const offLineList = [...state.offLineSocketUserList.filter(item => item.user.id !== responseData.user.id), responseData]
    const onLineList = state.onLineSocketUserList.filter(item => item.user.id !== responseData.user.id)
    dispatch(setSocketUserListAction(onLineList, offLineList, state.currentSocketUser))
    return;
  }
}

export default socketHandler
