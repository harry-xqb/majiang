/**
 *
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const env = process.env.NODE_ENV || 'dev'
let MYSQL_CONFIG
let REDIS_CONFIG
if(env === 'dev') {
  MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'majiang'
  }
  REDIS_CONFIG = {
    port: 6379,
    host: "127.0.0.1"
  }
}else if(env === 'prd') {
  MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'blog'
  }
  REDIS_CONFIG = {
    port: 6379,
    host: "127.0.0.1"
  }
}

module.exports = {
  MYSQL_CONFIG,
  REDIS_CONFIG

}
