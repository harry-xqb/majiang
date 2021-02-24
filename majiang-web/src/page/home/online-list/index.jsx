import React, {useContext, useEffect, useState} from 'react'
import styles from './index.module.scss'
import UserItem from "./UserItem";
import {HomeContext} from "../index";
import http from "../../../util/http";
import { setSocketUserListAction } from "../reducer";
import {Skeleton} from "antd";

/**
 * 在线用户列表
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const OnLineList = (props) => {

  const { state, dispatch } = useContext(HomeContext)

  const [loading, setLoading] = useState(false)

  const { showInvite, onInvite } = props;

  useEffect(() => {
    getConnectedUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 获取在线用户信息
  const getConnectedUsers = async () => {
    setLoading(true)
    const {success, data} = await http('/user/socketListInfo')
    setLoading(false)
    if(success) {
      dispatch(setSocketUserListAction(data.onLineSocketUserList, data.offLineSocketUserList))
    }
  }

  return (
    <Skeleton avatar paragraph={{ rows: 4 }} loading={loading}>
      <div className={styles.container}>
        <div style={{textAlign: 'center'}}>
          在线玩家: {state.onLineSocketUserList?.length}
        </div>
        {
          state.onLineSocketUserList?.map(item => <UserItem
            showInvite={showInvite}
            key={item.user.id}
            user={{username: item.user.username, status: item.socketData.status}}
            onInvite={() => onInvite(item.user.id)}
          />
          )
        }
        {
          state.offLineSocketUserList?.map(item => <UserItem key={item.user.id} user={{username: item.user.username, status: item.socketData.status}}/>)
        }
      </div>
    </Skeleton>
  )
}

OnLineList.defaultProps = {
  showInvite: false
}


export default OnLineList;
