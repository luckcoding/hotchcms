import { request, config } from 'utils'

const { api } = config
const { current, signIn, signOut } = api

export function login (params) {
  return request({
    url: signIn,
    method: 'put',
    data: params,
  })
}

export function logout () {
  return request({
    url: signOut,
    method: 'put',
  })
}

export function query () {
  return request({
    url: current,
    method: 'get',
  })
}
