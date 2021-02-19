import React from 'react'
import { useParams } from 'react-router-dom'
/**
 *
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const Room = () => {

  const { roomNumber } = useParams()

  return (
    <div>
      房间号：{ roomNumber }
    </div>
  )
}

export default Room;
