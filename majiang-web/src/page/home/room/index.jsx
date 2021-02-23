import React, {useContext, useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import OnLineList from "../online-list";
import {Button, Modal} from "antd";
import {HomeContext} from "../index";
import styles from './index.module.scss'
import User, {PREPARE_STATUS, USER_POSITION} from "./User";
import http from "../../../util/http";
import {setRoomDataAction} from "../reducer";

/**
 *
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const Room = () => {

  const { roomNumber } = useParams()

  const { state, dispatch } = useContext(HomeContext)

  const [roomLoading, setRoomLoading] = useState(false)

  const history = useHistory()

  useEffect(() => {
      getRoomInfo(roomNumber)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getRoomInfo = async (roomNumber) => {
    setRoomLoading(true)
    const { success, code, message, data} = await http.get('/room/info/' + roomNumber, {onError: false})
    setRoomLoading(false)
    if(success) {
      dispatch(setRoomDataAction(roomNumber, data.roomInfo, data.roomUserList))
    }else {
      if(code === 404) {
        Modal.info({
          title: message,
          onOk() {
            history.push('/home/lobby')
          }
        })
      }else {
        message.error(message)
      }
    }
  }

  const handleBackToLobby = () => {
    Modal.confirm({
      title: '确认退出当前房间',
      onOk() {
        http.post('/room/exit', {data: {roomNumber}})
        dispatch(setRoomDataAction(null, {}, []))
        history.push('/home/lobby')
      }
    })
  }
  const handleDisbandRoom = () => {
    Modal.confirm({
      title: '确认解散当前房间',
      onOk() {
        http.post('/room/disband', {data: {roomNumber}})
        dispatch(setRoomDataAction(null, {}, []))
        history.push('/home/lobby')
      }
    })
  }
  return (
      <div className='flex-container-row'>
        <div className={styles.side}>
          <OnLineList showInvite={true}/>
        </div>
          <div className={styles.center}>
            {/*<Spin spinning={roomLoading}>*/}
              <div style={{marginBottom: 10}}>
                房间号：{ roomNumber }
              </div>
              <div className={styles.room}>
                <User username={state.user?.username} position={USER_POSITION.BOTTOM}/>
                <User username={state.user?.username} position={USER_POSITION.RIGHT} status={PREPARE_STATUS.READY}/>
                <User username={state.user?.username} position={USER_POSITION.TOP}/>
                <User username={state.user?.username} position={USER_POSITION.LEFT}/>
              </div>
            {/*</Spin>*/}
          </div>
        <div className={styles.side}>
          <Button onClick={handleBackToLobby}>回到大厅</Button>
          {
            state.room?.roomInfo?.hostId === state.user.id && <Button onClick={handleDisbandRoom} style={{marginLeft: 20}}>解散房间</Button>
          }
        </div>
      </div>
  )
}

export default Room;
