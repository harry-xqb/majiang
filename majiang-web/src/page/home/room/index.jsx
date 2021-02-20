import React, {useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import OnLineList from "../online-list";
import {Button, Modal} from "antd";
import {HomeContext} from "../index";
import styles from './index.module.scss'
import User, {PREPARE_STATUS, USER_POSITION} from "./User";
import { useHistory } from 'react-router-dom'
/**
 *
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const Room = () => {

  const { roomNumber } = useParams()

  const { state } = useContext(HomeContext)

  const [roomLoading, setRoomLoading] = useState(false)

  const history = useHistory()

  useEffect(() => {

  }, [])

  const getRoomInfo = () => {

  }

  const handleBackToLobby = () => {
    Modal.confirm({
      title: '是否退出当前房间',
      onOk() {
        history.push('/home/lobby')
      }
    })
  }

  return (
    <div className='flex-container-row' style={{marginTop: 50}}>
      <div className={styles.side}>
        <OnLineList showInvite={true}/>
      </div>
      <div className={styles.center}>
        <div style={{marginBottom: 10}}>
          房间号：{ roomNumber }
        </div>
        <div className={styles.room}>
          <User username={state.user?.username} position={USER_POSITION.BOTTOM}/>
          <User username={state.user?.username} position={USER_POSITION.RIGHT} status={PREPARE_STATUS.READY}/>
          <User username={state.user?.username} position={USER_POSITION.TOP}/>
          <User username={state.user?.username} position={USER_POSITION.LEFT}/>
        </div>
      </div>
      <div className={styles.side}>
        <Button onClick={handleBackToLobby}>回到大厅</Button>
      </div>
    </div>
  )
}

export default Room;
