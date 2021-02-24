import React from 'react'
import styles from "./index.module.scss";
import {Avatar, Button} from "antd";
import classNames from "classnames";
import {USER_PREPARE_STATUS} from "../common";

export const USER_POSITION = {
  BOTTOM: 0,
  RIGHT: 1,
  TOP: 2,
  LEFT: 3,
}
export const POSITION_ORDER = Object.keys(USER_POSITION).map(key => USER_POSITION[key])



/**
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const User = (props) => {

  const { username, status, position, toggleReady, isHost, onStartGame, btnLoading} = props

  // 如果位置不在范围内0~4，则返回空
  if(!POSITION_ORDER.includes(position)) {
    return null
  }

  const userClasses = classNames({
    [styles.user]: true,
    [styles.bottom]: position === USER_POSITION.BOTTOM,
    [styles.right]: position === USER_POSITION.RIGHT,
    [styles.top]: position === USER_POSITION.TOP,
    [styles.left]: position === USER_POSITION.LEFT,
  })

  const renderButton = () => {
    if(position === USER_POSITION.BOTTOM) {
      if(isHost) {
        return <Button style={{marginTop: 5}} type='primary' onClick={onStartGame} loading={btnLoading}>开始游戏</Button>
      }
      if(status === USER_PREPARE_STATUS.READY) {
        return <Button style={{marginTop: 5}} onClick={() => toggleReady(false)} loading={btnLoading}>取消准备</Button>
      }
      return <Button style={{marginTop: 5}} type='primary' onClick={() => toggleReady(true)} loading={btnLoading}>准备</Button>
    }
    if(status === USER_PREPARE_STATUS.READY) {
      return <Button style={{marginTop: 5}} type='text'>已准备</Button>
    }
    return <Button style={{marginTop: 5}} type='text'>未准备</Button>
  }

  return (
    <div className={userClasses}>
      <Avatar size={48}>
        { username }
      </Avatar>
      {
        renderButton()
      }
    </div>
  )
}
User.defaultProps = {
  toggleReady: () => {},
  onStartGame: () => {}
}

export default User;
