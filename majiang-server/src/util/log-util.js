/**
 * 日志工具类
 * @author  Ta_Mu
 * @date 2021/1/6 14:23
 */
const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')

// 日志类型
const ACCESS = 'access'
const ERROR = 'error'
const EVENT = 'event'
// 日志访问流
const writeStreamMap = {
  [ACCESS]: {
    stream: undefined,
    date: undefined
  },
  [ERROR]: {},
  [EVENT]: {}
}

// 创建logs目录下的输出流
const getWriteStream = (type, logFormat = 'YYYY-MM-DD_') => {
  const currentDate = dayjs().format(logFormat)
  const writeStreamData = writeStreamMap[type]
  // 如果文件流存在， 并且日期与当前日期相等则复用当前流
  if(writeStreamData.stream && writeStreamData.date === currentDate) {
    return writeStreamData.stream
  }
  // 如果流存在，但日期不相等，则关闭当前流
  if(writeStreamData.stream) {
    writeStreamData.stream.close()
  }
  // 重新创建流, 并更新流的日期
  const fileNameWithDate = currentDate + type + '.log'
  const fullPath = path.join(__dirname, '../../../', 'logs/', fileNameWithDate)
  writeStreamData.stream = fs.createWriteStream(fullPath, {
    flags: 'a' // a->append:追加  w->write:覆盖
  })
  writeStreamData.date = currentDate
  return writeStreamData.stream
}
// 写日志
const writeLog = (writeStream, log) => {
  writeStream.write(log + '\n')
}
// 写访问日志
const access = (log) => {
  writeLog(getWriteStream(ACCESS), log)
}

module.exports = {
  access
}



