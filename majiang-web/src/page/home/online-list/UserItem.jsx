import React from 'react'
import styles from "./index.module.scss";
import {Avatar} from "antd";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import classNames from "classnames";
import {USER_STATUS, USER_STATUS_MAP} from "../common";

/**
 *
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const UserItem = (props) => {

  const { user, showInvite = false } = props

  const statusClass = classNames({
    [styles.status]: true,
    [styles.online]: user.status === USER_STATUS.ONLINE,
    [styles.inGame]: user.status === USER_STATUS.IN_GAME,
    [styles.inRoom]: user.status === USER_STATUS.IN_ROOM,
    [styles.offline]: user.status === USER_STATUS.OFFLINE,
  })

  return (
    <div className={styles.userList}>
      <div className={styles.userItem}>
        <Avatar>
          {user.username}
        </Avatar>
        <span className={statusClass}>
          {USER_STATUS_MAP[user.status]}
        </span>
        {
          user.status === USER_STATUS.ONLINE && showInvite && <PlusOutlined className={styles.invite}/>
        }
      </div>
    </div>
  )
}

export default UserItem;
