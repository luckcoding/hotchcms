import { request, config } from '../utils'

const { api } = config
const { current, signIn, signOut } = api

export async function login (params) {
  return request({
    url: signIn,
    method: 'put',
    data: params,
  })
}

export async function logout () {
  return request({
    url: signOut,
    method: 'put',
  })
}

export async function query () {
  return request({
    url: current,
    method: 'get',
  })
}
