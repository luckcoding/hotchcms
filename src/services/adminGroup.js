import { request, config } from '../utils'

const { api } = config
const { adminGroup } = api

export async function query (params) {
  return request({
    url: adminGroup,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: adminGroup.replace('/:_id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: adminGroup,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: adminGroup,
    method: 'put',
    data: params,
  })
}
