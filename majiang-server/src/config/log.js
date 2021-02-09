/**
 *
 * @author  Ta_Mu
 * @date 2021/1/14 13:37
 */
const path = require('path')
const rfs = require('rotating-file-stream')

const env = process.env.NODE_ENV

let LOG_CONFIG = {}
if(env === 'dev') {
  LOG_CONFIG = {
    format: 'dev',
    options: {
      stream: process.stdout
    }
  }
}else if (env === 'prd') {
  const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, '../../../', 'logs')
  })
  LOG_CONFIG = {
    format: 'combined',
    options: {
      stream: accessLogStream
    }
  }
}

module.exports = {
  LOG_CONFIG
}
