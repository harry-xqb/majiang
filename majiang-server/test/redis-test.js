/**
 *
 * @author  Ta_Mu
 * @date 2021/2/9 15:50
 */
const redis = require('../src/db/redis')

const testList = async () => {
  redis.listPush('test', [1, 2, 3])
  console.log('添加成功..')
  const result = await redis.listRange('test')
  console.log('获取成功：', result)
  const length = await redis.listLength('test')
  console.log('长度：', length)
  await redis.listRemove('test', 'harry')

}

const testHash = async () => {
  redis.hashSet('testhash', {user1: "adsfasf"})
  const result = await redis.hashGetAll('testhash')
  console.log("result:", result)
  const user1 = await redis.hashGet('testhash', 'user1')
  console.log("user1:", user1)
  redis.hashDel('testhash', ['user1'])
}

const sortedSet = async () => {
  redis.sortedSetAdd('sortSet', "1111", new Date().getTime())
  redis.sortedSetAdd('sortSet', "2222", new Date().getTime())
  redis.sortedSetAdd('sortSet', "3333", new Date().getTime())
  redis.sortedSetDelete('sortSet', '1111')
  const one = await redis.sortedSetExist('sortSet', '1111')
  console.error('one', one)
  const two = await redis.sortedSetExist('sortSet', '2222')
  console.error('two', two)
}
// sortedSet()
// testHash()
// testList()
