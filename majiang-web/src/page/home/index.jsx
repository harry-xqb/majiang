import React, {createContext, useEffect, useReducer, useRef, useState} from 'react'
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import Room from "./room";
import {initState, initUserAction, reducer} from "./reducer";
import Lobby from "./lobby";
import {Avatar, message, Modal, Spin} from "antd";
import http from "../../util/http";
import {delToken, getToken} from "../../util/token-util";
import useLogout from "../../hook/useLogout";
import {USER_STATUS} from "./common";
import socketHandler from "./socket-handler/index";

export const HomeContext = createContext({})

/**
 *
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const Home = () => {

  const [userInfoLoading, setUserInfoLoading] = useState(false)
  const [state, dispatch] = useReducer(reducer, initState)
  const history = useHistory()
  const socketRef = useRef()
  const stateRef = useRef(state)
  const logout = useLogout()

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    if (state.authenticated) {
      // 建立websocket连接，
      createWebsocket()
    }
    return () => {
      socketRef.current?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.authenticated])

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
      // 如果当前用户已经在房间，则进入房间
      if(data.socketData?.status === USER_STATUS.IN_ROOM) {
        history.push('/home/room/' + data.socketData.roomNumber)
      }
    }
  }

  const createWebsocket = () => {
    const port = window.location.port
    const ws = new WebSocket(`ws://localhost:${port}/websocket/home/${getToken()}`)
    ws.onmessage = (evt) => {
      const response = JSON.parse(evt.data)
      if(response.code === 0) {
        socketHandler(response.data.messageType.code, response.data.responseData, stateRef.current, dispatch, history)
        return
      }
      message.error(response.method)
    }
    ws.onclose = (event) => {
      if(event.code === 3001) {
        delToken()
        http.post('/user/logout')
        Modal.info({
          title: '您的账号在其他地方登录,请重新登录',
          onOk() {
            history.push('/login')
          },
        });
        return
      }
      if(event.code !== 1005) {
        Modal.confirm({
          title: '与服务器断开连接，是否重新连接',
          onOk() {
            window.location.reload()
          },
          onCancel() {
            logout()
          }
        });
      }
    }
    socketRef.current = ws
  }

  return (
    <HomeContext.Provider value={{state, dispatch}}>
      <Spin spinning={userInfoLoading}>
        <div style={{width: '100vw', height: '100vh'}}>
          <div className='flex-container-col' style={{top: 100}}>
            <div className='flex-container-row' >
              <Avatar size={64} style={{marginBottom: 10}}>
                {state.user?.username}
              </Avatar>
            </div>
           <Switch>
              <Route exact path='/home' render={() => <Redirect to='/home/lobby'/>}/>
              <Route exact path='/home/lobby' component={Lobby}/>
              <Route path='/home/room/:roomNumber' component={Room}/>
              <Redirect to="/404"/>
            </Switch>
          </div>
        </div>
      </Spin>
    </HomeContext.Provider>
  )
}

export default Home;
