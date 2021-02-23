import React, {useContext, useState} from 'react'
import {Avatar, Button, message, Modal, Spin} from "antd";
import styles from "./index.module.scss";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {HomeContext} from "../index";
import OnLineList from "../online-list";
import {useHistory} from 'react-router-dom'
import EnterRoomModal from "./EnterRoomModal";
import http from "../../../util/http";

/**
 *
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const Lobby = () => {

  const { state } = useContext(HomeContext)

  const history = useHistory()

  const [createLoading, setCreateLoading] = useState(false)

  const [enterRoomModalVisible, setEnterRoomModalVisible] = useState(false)

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

  const handleCreateRoom = async () => {
    setCreateLoading(true)
    const { success, data } = await http.post('/room/create')
    setCreateLoading(false)
    if(success) {
      message.success('创建成功!')
      history.push('/home/room/' + data.roomNumber)
    }
  }


  return (
    <div className='flex-container-row'>
      <div style={{width: 200}}>
        <OnLineList showInvite={false}/>
      </div>
      <div className={styles.userInfo}>
        <div style={{marginBottom: 10}}>主页</div>
        <Avatar size={64} style={{marginBottom: 10}}>
          {state.user?.username}
        </Avatar>
        <div style={{marginTop: 20}}>
          <Button type='primary' onClick={() => setEnterRoomModalVisible(true)}>
            加入房间
          </Button>
          <Button type='primary' style={{marginLeft: 30}} icon={<PlusOutlined/>} onClick={handleCreateRoom} loading={createLoading}>
            创建房间
          </Button>
        </div>
      </div>
      <div style={{width: 200}}>
        <Button onClick={handleLogout}>注销</Button>
      </div>
      <EnterRoomModal visible={enterRoomModalVisible} onCancel={() => setEnterRoomModalVisible(false)}/>
    </div>
  )
}

export default Lobby;
