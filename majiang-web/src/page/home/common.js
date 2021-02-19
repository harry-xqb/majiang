/**
 *
 * @author  Ta_Mu
 * @date 2021/2/19 14:09
 */
// 用户状态
const ONLINE = 0
const IN_GAME = 1
const IN_ROOM = 2
const OFFLINE = 3
export const USER_STATUS = {
  ONLINE,
  IN_GAME,
  IN_ROOM,
  OFFLINE,
}
export const USER_STATUS_MAP = {
  [ONLINE]: '在线',
  [IN_GAME]: '游戏中',
  [IN_ROOM]: '在房间中',
  [OFFLINE]: '离线',
}
