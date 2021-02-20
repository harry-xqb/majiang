import React, {createContext, useEffect, useReducer, useRef, useState} from 'react'
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import Room from "./room";
import {initState, initUserAction, reducer} from "./reducer";
import Lobby from "./lobby";
import {message, Modal, Spin} from "antd";
import http from "../../util/http";
import socketHandler from "./socket-handler";
import {delToken, getToken} from "../../util/token-util";

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
    }
  }

  const createWebsocket = () => {
    const ws = new WebSocket(`ws://localhost:3000/home/${getToken()}`)
    ws.onmessage = (evt) => {
      const response = JSON.parse(evt.data)
      if(response.code === 0) {
        // todo 同一个浏览器多个tab登录时会有bug
        socketHandler(response.data.messageType.code, response.data.responseData, stateRef.current, dispatch)
        return
      }
      message.error(response.method)
    }
    ws.onclose = (event) => {
      if(event.code === 3001) {
        delToken()
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
            createWebsocket()
          },
          onCancel() {
            delToken()
            history.push('/login')
          }
        });
      }
    }
    socketRef.current = ws
  }


  return (
    <HomeContext.Provider value={{state, dispatch}}>
      <Spin spinning={userInfoLoading}>
        <Switch>
          <Route exact path='/home' render={() => <Redirect to='/home/lobby'/>}/>
          <Route exact path='/home/lobby' component={Lobby}/>
          <Route path='/home/room/:roomNumber' component={Room}/>
          <Redirect to="/404"/>
        </Switch>
      </Spin>
    </HomeContext.Provider>
  )
}

export default Home;
