/**
 *
 * @author  Ta_Mu
 * @date 2021/2/20 9:23
 */
const TOKEN = 'token'

export const getToken = () => {
  return sessionStorage.getItem(TOKEN)
}

export const setToken = (value) => {
  return sessionStorage.setItem(TOKEN, value)
}

export const delToken = () => {
  return sessionStorage.removeItem(TOKEN)
}

