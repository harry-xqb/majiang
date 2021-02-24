/**
 *
 * @author  Ta_Mu
 * @date 2021/2/19 10:04
 */
import axios from "axios";
import { message } from "antd";
import {delToken, getToken} from "./token-util";
axios.defaults.timeout = 50000;
axios.defaults.baseURL = "/api";

const DEFAULT_CONFIG = {
  method: 'GET',
  data: {},
  ignore: [null, undefined], // 忽略请求参数
  onError: true, // 请求结果不成功时自动提示报错
  authRedirect: true, // 请求返回401时自动重定向
  contentType: 'json'
}
const request = (url, config) => {

  // debugger
  config = {...DEFAULT_CONFIG, ...config}
  if(config.data) {
    let tmpBody = config.data || {}
    // 过滤掉忽略的值
    const resultBody = {}
    Object.keys(tmpBody).filter(key => !(config.ignore || []).includes(tmpBody[key])).forEach(key => {
      resultBody[key] = tmpBody[key]
    })
    // get方法则往url后拼接参数
    if(config.method === 'GET') {
      let requestParams = url?.endsWith('?') ? '1=1' : '?1=1'
      Object.keys(resultBody).forEach(key => {
        requestParams += `&${key}=${resultBody[key]}`
      })
      url = (url + requestParams).replace('1=1&', '').replace('1=1', '')
      config.data = null
    }else {
      config.data = resultBody
    }
  }
  config.headers = {
    token: getToken()
  }
  return axios({
    url,
    data: config.data,
    ...config
  }).then(response => {
    const responseData = response.data
    if(responseData.code === 0) {
      return {
        success: true,
        ...responseData
      }
    }
    if(responseData.code === 401 && config.authRedirect) {
      message.error('未登录或token过期')
      delToken()
      window.location = '/login'
      return
    }
    return errorHandler(config.onError, responseData)
  }).catch(err => {
    console.error(err)
    return errorHandler(config.onError, {message: '请求失败'})
  })
}
const errorHandler = (onError, responseData) => {
  if(onError) {
    message.error(responseData.message)
  }
  return {
    success: false,
    ...responseData
  }
}
const http = request
http.get = request
http.post = (url, config) => request(url, {method: 'post', ...config})
http.put = (url, config) => request(url, {method: 'put', ...config})
http.delete = (url, config) => request(url, {method: 'delete', ...config})

export default http
