import React, {useContext, useEffect} from 'react'
import styles from './index.module.scss'
import UserItem from "./UserItem";
import {HomeContext} from "../index";
import http from "../../../util/http";
import { setSocketUserListAction } from "../reducer";

/**
 * 在线用户列表
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const OnLineList = (props) => {

  const { state, dispatch } = useContext(HomeContext)

  useEffect(() => {
    getConnectedUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 获取在线用户信息
  const getConnectedUsers = async () => {
    const {success, data} = await http('/user/socketListInfo')
    if(success) {
      dispatch(setSocketUserListAction(data.onLineSocketUserList, data.offLineSocketUserList, data.currentSocketUser))
    }
  }

  return (
    <div className={styles.container}>
      <div style={{textAlign: 'center'}}>
        在线玩家: {state.onLineSocketUserList?.length}
      </div>
      {
        state.onLineSocketUserList?.map(item => <UserItem showInvite={props.showInvite} key={item.user.id} user={{username: item.user.username, status: item.socketData.status}}/>)
      }
      {
        state.offLineSocketUserList?.map(item => <UserItem key={item.user.id} user={{username: item.user.username, status: item.socketData.status}}/>)
      }
    </div>
  )
}

OnLineList.defaultProps = {
  showInvite: false
}


export default OnLineList;
