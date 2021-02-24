import {message, Modal} from "antd";
import {setSocketUserListAction} from "../reducer";
/**
 *
 * @author  Ta_Mu
 * @date 2021/2/24 16:04
 */
const systemSocketHandler = (messageCode, responseData, state, dispatch) => {
  if(messageCode === 2001) { // 系统消息->连接成功
    message.info('用户（' + responseData.user.username + '）已上线')
    const offLineList = state.offLineSocketUserList.filter(item => item.user.id !== responseData.user.id)
    const onLineList = [...state.onLineSocketUserList.filter(item => item.user.id !== responseData.user.id), responseData]
    dispatch(setSocketUserListAction(onLineList, offLineList))
    return
  }
  if(messageCode === 2003) { // 系统消息->掉线
    const offLineList = [...state.offLineSocketUserList.filter(item => item.user.id !== responseData.user.id), responseData]
    const onLineList = state.onLineSocketUserList.filter(item => item.user.id !== responseData.user.id)
    dispatch(setSocketUserListAction(onLineList, offLineList))
    return;
  }
  if(messageCode === 2004) { // 系统消息->在线用户状态改变
    const onLineList = state.onLineSocketUserList.map(item => {
      if(item.user.id === responseData.userId) {
        item.socketData = {status: responseData.status}
      }
      return item
    })
    dispatch(setSocketUserListAction(onLineList, state.offLineSocketUserList))
    return;
  }
  if(messageCode === 2005) { // 系统消息->批量在线用户状态改变
    const onLineList = state.onLineSocketUserList.map(item => {
      if(responseData.userIdList?.includes(item.user.id)) {
        item.socketData = {status: responseData.status}
      }
      return item
    })
    dispatch(setSocketUserListAction(onLineList, state.offLineSocketUserList))
    return;
  }
  if(messageCode === 2006) { // 系统消息->邀请加入游戏
    Modal.confirm({
      title: `(玩家${responseData.user.username})邀请您加入游戏`,
      okText: '同意',
      cancelText: '拒绝',
      onOk() {

      },
      onCancel() {

      }
    })
  }
}


export default systemSocketHandler
