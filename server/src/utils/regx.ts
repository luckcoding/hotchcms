
export const email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

export const phone = /^1[3|4|5|7|8]\d{9}$/

export function isEmail(value: any): boolean {
  return email.test(value)
}

export function isPhone(value: any): boolean {
  return phone.test(value)
}
