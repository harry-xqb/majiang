import React, {useContext, useEffect, useState} from 'react'
import {Avatar, Button, message, Modal, Spin} from "antd";
import styles from "./index.module.scss";
import {PlusOutlined} from "@ant-design/icons";
import http from "../../../util/http";
import {initUserAction} from "../reducer";
import {HomeContext} from "../index";
import OnLineList from "./online-list";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom'
/**
 *
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const Lobby = () => {

  const { state, dispatch } = useContext(HomeContext)

  const [userInfoLoading, setUserInfoLoading] = useState(false)

  const history = useHistory()

  useEffect(() => {
    getUserInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getUserInfo = async () => {
    setUserInfoLoading(true)
    const {success, data} = await http.get('/user/info')
    setUserInfoLoading(false)
    if (success) {
      dispatch(initUserAction(data))
    }
  }

  const handleLogout = () => {
    Modal.confirm({
      title: '是否注销登录',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        localStorage.removeItem('token')
        message.success('注销成功')
        history.push('/login')
      },
    });
  }

  return (
    <Spin spinning={userInfoLoading}>
      <div className={styles.container}>
        <div style={{width: 200}}>
          <OnLineList/>
        </div>
        <div className={styles.userInfo}>
          <div style={{marginBottom: 10}}>主页</div>
          <Avatar size={64} style={{marginBottom: 10}}>
            {state.user?.username}
          </Avatar>
          <div style={{marginTop: 20}}>
            <Button type='primary'>
              加入房间
            </Button>
            <Button type='primary' style={{marginLeft: 30}} icon={<PlusOutlined/>}>
              创建房间
            </Button>
          </div>
        </div>
        <div style={{width: 200}}>
          <Button onClick={handleLogout}>注销</Button>
        </div>
      </div>
    </Spin>
  )
}

export default Lobby;
