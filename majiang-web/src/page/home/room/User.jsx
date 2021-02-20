import React from 'react'
import styles from "./index.module.scss";
import {Avatar, Button} from "antd";
import classNames from "classnames";

export const USER_POSITION = {
  BOTTOM: 0,
  RIGHT: 1,
  TOP: 2,
  LEFT: 3,
}

export const PREPARE_STATUS = {
  UNREADY: 0,
  READY: 1
}

/**
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const User = (props) => {

  const { username, status, position, toggleReady, isHost, onStartGame} = props

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
        return <Button style={{marginTop: 5}} type='primary' onClick={onStartGame}>开始游戏</Button>
      }
      if(status === PREPARE_STATUS.READY) {
        return <Button style={{marginTop: 5}} onClick={toggleReady}>取消准备</Button>
      }
      return <Button style={{marginTop: 5}} type='primary' onClick={toggleReady}>准备</Button>
    }
    if(status === PREPARE_STATUS.READY) {
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
