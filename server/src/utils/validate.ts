import shortid from 'shortid'

export const regx = {
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  phone: /^1[3|4|5|7|8]\d{9}$/
}

export const isJson = (value: any): boolean => Object.prototype.toString.call(value).toLowerCase() === '[object object]'

export const isArray = (value: any): boolean => Array.isArray(value)

export const isString = (value: any): boolean => typeof value === 'string'

export const isNumber = (value: any): boolean => !Number.isNaN(Number(value))

export const isId = (value: any): boolean => shortid.isValid(value)

export const isEmail = (value: any): boolean => regx.email.test(value)

export const isPhone = (value: any): boolean => regx.phone.test(value)
