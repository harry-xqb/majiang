/**
 * 加密
 * @author  Ta_Mu
 * @date 2021/1/8 11:40
 */

const crypto = require('crypto')
const arr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
// 生成md5摘要
const encrypt = (content) => {
  const md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex')
}
// 生成加密后的盐
const generateSalt = () => {
  let salt = ''
  for(let i = 0; i < 10; i++) {
    const randomLetterIndex = Math.floor(Math.random() * 26)
    const randomCase = Math.floor(Math.random() * 2) === 1
    let letter = randomCase ? arr[randomLetterIndex].toLocaleLowerCase() : arr[randomLetterIndex]
    salt +=  letter
  }
  return encrypt(salt)
}
// 密码加密
const passwordEncode = (password) => {
  const salt = generateSalt()
  const encryptedPassword = encrypt(password + salt)
  return encryptedPassword + '_' + salt;
}
// 判断原密码是否匹配
const passwordMatch = (rawPassword, encodedPassword) => {
  if(encodedPassword == null || encodedPassword.length === 0) {
    console.warn('加密密码为空')
    return false
  }
  const encodedPasswordArr = encodedPassword.split('_')
  if(encodedPasswordArr.length !== 2) {
    console.warn('加密密码不符合passwordEncode的加密规则')
    return false
  }
  const salt = encodedPasswordArr[1]
  return encrypt(rawPassword + salt) === encodedPasswordArr[0]
}

const EncryptUtil = {
  passwordEncode,
  passwordMatch,
  encrypt
}

module.exports = EncryptUtil
