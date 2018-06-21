import { request, config } from 'utils'

const { api } = config
const { signIn, captcha } = api

export async function login (data) {
  return request({
    url: signIn,
    method: 'put',
    data,
  })
}

export async function getCaptcha () {
  return request({
    url: captcha,
    method: 'get',
  })
}
