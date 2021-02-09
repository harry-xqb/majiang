/**
 *
 * @author  Ta_Mu
 * @date 2021/2/9 14:38
 */
const {exec, escape} = require('../db/mysql')

// 创建房间
const createRoom = async (room = {}) => {
  const { id, roomNumber, hostId, status } = room
  const sql = `insert into room (id, room_number, host_id, status) values (
    ${escape(id)},
    ${escape(roomNumber)},
    ${escape(hostId)},
    ${escape(status)}
  )`
  return await exec(sql)
}

module.exports = {
  createRoom
}
