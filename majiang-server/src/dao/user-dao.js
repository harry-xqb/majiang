/**
 * 用户数据库访问层
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const {exec, escape} = require('../db/mysql')

// 通过用户名获取用户
const getByUsername = async (username) => {
  const sql = `select * from user where username = ${escape(username)}`
  const result =  await exec(sql)
  return result && result[0]
}
// 通过id获取用户
const getById = async (id) => {
  const sql = `select * from user where id = ${escape(id)}`
  return exec(sql)
}
// 创建用户
const createUser = async (user = {}) => {
  const {id, username, password, phone } = user
  const sql = `insert into user (id, username, password, phone) values (
    ${escape(id)},
    ${escape(username)},
    ${escape(password)},
    ${escape(phone)}
  )`
  return await exec(sql)
}

// 通过手机号获取用户
const getByPhone = async (phone) => {
  const sql = `select * from user where phone = ${escape(phone)}`
  const result =  await exec(sql)
  return result && result[0]
}

module.exports = {
  getByUsername,
  getById,
  createUser,
  getByPhone
}
