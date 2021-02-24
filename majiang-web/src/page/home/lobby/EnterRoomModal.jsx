import React, {useEffect, useState} from 'react'
import {Input, message, Modal} from "antd";
import styles from './index.module.scss'
import http from "../../../util/http";

/**
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const ROOM_INPUT = [0, 1, 2, 3, 4, 5];
const EnterRoomModal = (props) => {

  const { onCancel, afterOk, visible} = props

  const [confirmLoading, setConfirmLoading] = useState(false)
  const [inputRef] = useState([])
  const [inputValueArray, setInputValueArray] = useState([])

  const handleInputChange = (value, index) => {
    const tmpArray = [...inputValueArray]
    tmpArray[index] = value
    setInputValueArray(tmpArray)
    if(value.length === 1) {
      if(index < ROOM_INPUT.length - 1) {
        inputRef[index + 1]?.focus({cursor: 'all'})
      }else {
        inputRef[index].blur()
      }
    }
  }

  useEffect(() => {
    if(visible) {
      // 列表渲染后执行
      setTimeout(() => {
        inputRef[0].focus()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleFocus = (e) => {
    e.target.select()
  }

  const handleOk = () => {
    if(inputValueArray.length !== ROOM_INPUT.length) {
      message.warn('房间号长度有误')
      return
    }
    if(inputValueArray.find(item => item == null)) {
      message.warn('房间号不完整')
      return;
    }
    const roomNumber = inputValueArray.join('')
    joinRoom(roomNumber)
  }

  const handleAfterClose = () => {
    setInputValueArray([])
    setConfirmLoading(false)
  }

  const joinRoom = async (roomNumber) => {
    setConfirmLoading(true)
    const { success } = await http.post('/room/join', {data: {roomNumber}})
    setConfirmLoading(false)
    if(success) {
      afterOk(roomNumber)
    }
  }
  const handlePaste = (e) => {
    const clipText = e.clipboardData.getData('Text')
    const codeArray = clipText?.substr(0, 6).split('') || []
    setInputValueArray(codeArray)
  }

  return (
    <Modal
      afterClose={handleAfterClose}
      visible={visible}
      title='请输入您要加入的房间号'
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}>
      <div className={styles.roomNumberContainer}>
        {
          ROOM_INPUT.map((item, index) =>
            <Input key={item}
                   className={styles.roomNumberInput}
                   maxLength={1}
                   onPaste={handlePaste}
                   value={inputValueArray[item]}
                   onFocus={handleFocus}
                   ref={ref => inputRef[index] = ref}
                   onChange={e => handleInputChange(e.target.value, index)}
            />
          )
        }
      </div>
    </Modal>
  )
}

export default EnterRoomModal;
