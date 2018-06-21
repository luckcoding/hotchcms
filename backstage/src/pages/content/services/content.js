import { request, config } from 'utils'

const { api } = config
const { content } = api

export function query (params) {
  return request({
    url: content,
    method: 'get',
    data: params,
  })
}

export function create (params) {
  return request({
    url: content.replace('/:_id', ''),
    method: 'post',
    data: params,
  })
}

export function remove (params) {
  return request({
    url: content,
    method: 'delete',
    data: params,
  })
}

export function update (params) {
  return request({
    url: content,
    method: 'put',
    data: params,
  })
}
