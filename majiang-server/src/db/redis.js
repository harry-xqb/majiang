/**
 * Redis工具类
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const redis = require('redis')
const { REDIS_CONFIG } = require('../config/db')

// 建立连接
const redisClient = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host);


redisClient.on('error', (err) => {
  console.error('redis错误:', err.message)
})

// 获取值
const get = (key) => {
  return new Promise(((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if(err) {
        console.error(err)
        resolve(null)
        return
      }
      resolve(val)
    })
  }))
}
// 设置值
const set = (key, value, expire) => {
  let val = value;
  if(value != null && typeof value === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val)
  if(expire != null) {
    redisClient.expire(key, expire)
  }
}
const del = (key) => {
  redisClient.del(key)
}
// list添加
const listPush = (key, value) => {
  redisClient.send_command('rpush', [key, ...parseToArray(value)])
}
// 移除list中的元素
const listRemove = (key, value) => {
  redisClient.send_command('lrem', [key, 0, value])
}
// 获取指定范围元素， 不传start和end则获取所有
const listRange = (key, start = 0, end = -1) => {
  return new Promise(((resolve, reject) => {
    redisClient.send_command('lrange', [key, start, end], (err, data) => {
      if(err) {
        console.error(err)
        resolve([])
        return
      }
      resolve(data)
    })
  }))
}
// 获取列表长度
const listLength = (key) => {
  return new Promise(((resolve, reject) => {
    redisClient.send_command('llen', [key], (err, data) => {
      if(err) {
        console.error(err)
        resolve(0)
        return
      }
      resolve(data)
    })
  }))
}

const hashSet = (key, field, value) => {
  redisClient.hmset(key, field, value)
}
const hashGet = (key, field) => {
  return new Promise(((resolve, reject) => {
    redisClient.hget(key, field, (err, result) => {
      if(err) {
        console.error(err)
        resolve(null)
        return
      }
      resolve(result)
    })
  }))
}
const hashDel = (key, fields) => {
  redisClient.send_command('hdel', [key, ...parseToArray(fields)])
}
const hashGetAll = async (key) => {
  return new Promise(((resolve, reject) => {
    redisClient.hgetall(key, (err, data) => {
      if(err) {
        console.error(err)
        resolve(null)
        return
      }
      resolve(data)
    })
  }))
}
// 排序集合
const sortedSetAdd = (key, value, priority) => {
  redisClient.zadd([key, priority, value])
}
// 移除排序集合中的元素
const sortedSetDelete = (key, values) => {
  redisClient.send_command('zrem', [key, ...parseToArray(values)])
}
// 判断值是否在有序集合中存在
const sortedSetExist = (key, value) => {
  return new Promise(((resolve, reject) => {
    redisClient.send_command('zrank', [key, value], (err, data) => {
      if(err) {
        console.error(err)
        return resolve(false)
      }
      if(data === null) {
        resolve(false)
      }
      resolve(true)
    })
  }))
}

const parseToArray = (value) => {
  if(Array.isArray(value)) {
    return [...value]
  }
  return [value]
}

module.exports = {
  get,
  set,
  del,
  listLength,
  listRange,
  listRemove,
  listPush,
  hashSet,
  hashGet,
  hashGetAll,
  hashDel,
  sortedSetAdd,
  sortedSetDelete,
  sortedSetExist,
  redisClient
}
