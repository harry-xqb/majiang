import React, {createContext, useEffect, useReducer, useRef} from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import Room from "../room";
import {initState, reducer, setOnlineUserListAction} from "./reducer";
import Lobby from "./lobby";
import {Button, message, Modal} from "antd";
import http from "../../util/http";
import socketHandler from "./socket-handler";
import { useHistory } from 'react-router-dom'

export const HomeContext = createContext({})

/**
 *
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const Home = () => {

  const [state, dispatch] = useReducer(reducer, initState)

  const history = useHistory()

  const socketRef = useRef()

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

  const createWebsocket = () => {
    const ws = new WebSocket(`ws://localhost:3000/home/${localStorage.getItem('token')}`)
    ws.onmessage = (evt) => {
      const response = JSON.parse(evt.data)
      if(response.code === 0) {
        // todo 同一个浏览器多个tab登录时会有bug
        socketHandler(response.data.messageType.code, response.data.responseData, state, dispatch)
        return
      }
      message.error(response.method)
    }
    ws.onclose = (event) => {
      console.log(event)
      if(event.code === 3001) {
        Modal.info({
          title: '您的账号在其他地方登录,请重新登录',
          onOk() {
            // localStorage.removeItem('token')
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
            localStorage.removeItem('token')
            history.push('/login')
          }
        });
      }
    }
    socketRef.current = ws
  }


  return (
    <HomeContext.Provider value={{state, dispatch}}>
      <Switch>
        <Route exact path='/home' render={() => <Redirect to='/home/lobby'/>}/>
        <Route exact path='/home/lobby' component={Lobby}/>
        <Route path='/home/room/:roomNumber' component={Room}/>
        <Redirect to="/404"/>
      </Switch>
    </HomeContext.Provider>
  )
}

export default Home;
