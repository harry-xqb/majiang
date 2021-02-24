import { useHistory } from 'react-router-dom'
import http from "../util/http";
import {delToken} from "../util/token-util";
import {message} from "antd";
/**
 * @author  Ta_Mu
 * @date 2021/2/24 13:48
 */
const useLogout = () => {
  const history = useHistory()
  return () => {
    http.post('/user/logout', {onError: false})
    delToken()
    history.push('/login')
  }
}

export default useLogout
