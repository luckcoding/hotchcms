import { request, config } from '../utils'

const { api } = config
const { adminUser } = api

export async function query (params) {
  return request({
    url: adminUser.replace('/:_id', ''),
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: adminUser,
    method: 'delete',
    data: params,
  })
}
