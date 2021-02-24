import React, {useContext, useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import OnLineList from "../online-list";
import {Button, message, Modal, Spin} from "antd";
import {HomeContext} from "../index";
import styles from './index.module.scss'
import User from "./User";
import http from "../../../util/http";
import {setRoomDataAction, setRoomDataUserList} from "../reducer";
import {USER_PREPARE_STATUS} from "../common";

/**
 *
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const Room = () => {

  const {roomNumber} = useParams()

  const {state, dispatch} = useContext(HomeContext)

  const [roomLoading, setRoomLoading] = useState(false)

  const [startBtnLoading, setStartBtnLoading] = useState(false)

  const history = useHistory()

  useEffect(() => {
    getRoomInfo(roomNumber)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getRoomInfo = async (roomNumber) => {
    setRoomLoading(true)
    const {success, code, message: msg, data} = await http.get('/room/info/' + roomNumber, {onError: false})
    setRoomLoading(false)
    if (success) {
      dispatch(setRoomDataAction(roomNumber, data.roomInfo, data.roomUserList))
    } else {
      if (code === 404) {
        Modal.info({
          title: msg,
          onOk() {
            history.push('/home/lobby')
          }
        })
      } else {
        message.error(msg)
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

  const handleStartGame = () => {

  }

  const handleToggleReady = async (userId, isReady) => {
    const status = isReady ? USER_PREPARE_STATUS.READY : USER_PREPARE_STATUS.UNREADY
    setStartBtnLoading(true)
    const {success} = await http.post('/room/changeUserStatus', {data: {roomNumber, status}})
    setStartBtnLoading(false)
    if(success) {
      let roomUserList = state.room.roomUserList
      roomUserList = roomUserList.map(item => {
        if(item.id === userId) {
          item.roomData = {...item.roomData, status: status}
        }
        return item
      })
      dispatch(setRoomDataUserList(roomUserList))
    }
  }

  const handleInviteUser = async (inviteUserId) => {
    const { success } = await http.post('/room/invite', { data: { roomNumber, inviteUserId}})
    if(success) {
      message.info('邀请已发送')
    }
  }


  return (
    <div className='flex-container-row'>
      <div className={styles.side}>
        <OnLineList showInvite={true} onInvite={handleInviteUser}/>
      </div>
      <Spin spinning={roomLoading}>
        <div className={styles.center}>
          <div style={{marginBottom: 10}}>
            房间号：{roomNumber}
          </div>
          <div className={styles.room}>
            {
              state.room.roomUserList?.map((item, index) =>
                <User key={item.id}
                      username={item.username}
                      position={index}
                      btnLoading={startBtnLoading}
                      status={item.roomData?.status}
                      isHost={item.id === state.room?.roomInfo?.hostId}
                      onStartGame={handleStartGame}
                      toggleReady={(isReady) => handleToggleReady(item.id, isReady)}
                />)
            }
          </div>
        </div>
      </Spin>
      <div className={styles.side}>
        <Button onClick={handleBackToLobby}>回到大厅</Button>
        {
          state.room?.roomInfo?.hostId === state.user?.id &&
          <Button onClick={handleDisbandRoom} style={{marginLeft: 20}}>解散房间</Button>
        }
      </div>
    </div>
  )
}

export default Room;
