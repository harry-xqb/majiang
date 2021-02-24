/**
 *
 * @author  Ta_Mu
 * @date 2021/2/24 16:02
 */
import roomSocketHandler from "./room-socket-handler";
import systemSocketHandler from "./system-socket-handler";

const socketHandler = (messageCode, responseData, state, dispatch, history) => {

  if(messageCode < 2000) { // 房间消息
    roomSocketHandler(messageCode, responseData, state, dispatch, history)
    return
  }
  if(messageCode < 3000) { // 系统消息
    systemSocketHandler(messageCode, responseData, state, dispatch, history)
  }

}

export default socketHandler
