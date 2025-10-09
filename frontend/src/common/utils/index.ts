export const randomInt = (min: number, max: number) => Math.round(Math.random() * (max - min) + min)

export const getType = (data: any) => Object.prototype.toString.call(data).split(' ')[1].slice(0, -1)

/**
 * 用于获取对象的所有属性集合
 * 等同于 Object.keys
 * 可以正确获取key所对应的类型
 * @param data 对象
 * @returns
 */
export const objectKeys = <T extends object>(obj: T) => Object.keys(obj) as (keyof T)[]

export const copyText = (str: string) => navigator.clipboard.writeText(str)

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + units[i]
}

// base64解码
export const base64Decode = (inputString: string) => {
  try {
    // 使用atob函数进行Base64解码
    const decodedString = atob(inputString)
    return decodedString
  } catch (err) {
    // 处理解码错误，比如输入不是有效的Base64编码
    console.error('Error decoding Base64 string:', err)
    return ''
  }
}

export const validateEmail = (email:string) => {
  if (!email) return false
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email)
}

export const validatePwd = (pwd:string) => {
  if (!pwd) return false
  const hasUpperCase = /[A-Z]/.test(pwd)
  const hasLowerCase = /[a-z]/.test(pwd)
  const hasNumbers = /\d/.test(pwd)
  // const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  const passedTests = [hasUpperCase, hasLowerCase, hasNumbers].filter(Boolean).length
  return passedTests === 3
}

export const validatePwdLength = (pwd:string) => {
  if (!pwd) return false
  if (pwd.length < 6 || pwd.length > 18) {
    return false
  }
  return true
}
