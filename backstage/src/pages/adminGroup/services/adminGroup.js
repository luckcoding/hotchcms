import { request, config } from 'utils'

const { api } = config
const { adminGroup } = api

export function query (params) {
  return request({
    url: adminGroup,
    method: 'get',
    data: params,
  })
}

export function create (params) {
  return request({
    url: adminGroup.replace('/:_id', ''),
    method: 'post',
    data: params,
  })
}

export function remove (params) {
  return request({
    url: adminGroup,
    method: 'delete',
    data: params,
  })
}

export function update (params) {
  return request({
    url: adminGroup,
    method: 'put',
    data: params,
  })
}
