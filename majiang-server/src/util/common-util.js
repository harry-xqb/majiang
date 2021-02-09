/**
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const UUID = require('uuid');

/**
 * 文本转义
 * @param str 原始文本内容
 * @returns {*} 转义后的文本内容
 */
const toLiteral = (str) => {
  const dict = {'\b': 'b', '\t': 't', '\n': 'n', '\v': 'v', '\f': 'f', '\r': 'r'};
  return str.replace(/([\\'"\b\t\n\v\f\r])/g, function ($0, $1) {
    return '\\' + (dict[$1] || $1);
  })
}
/**
 * 获取指定长度随机数字
 * @param len 长度
 * @returns {string} 数字字符串
 */
const randomNumberStr = (len) => {
  let str = ''
  for(let i = 0; i < len; i++) {
    str += Math.floor(Math.random() * 10)
  }
  return str
}
/**
 * 生成随机32位id
 */
const createUUID = () => {
  return UUID.v4().replace(/-/g, '').substr(0, 32)
}

module.exports = {
  toLiteral,
  randomNumberStr,
  createUUID
}
