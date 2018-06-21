import { request, config } from 'utils'

const { api } = config
const { category } = api

export function query (params) {
  return request({
    url: category,
    method: 'get',
    data: params,
  })
}

export function create (params) {
  return request({
    url: category.replace('/:_id', ''),
    method: 'post',
    data: params,
  })
}

export function remove (params) {
  return request({
    url: category,
    method: 'delete',
    data: params,
  })
}

export function update (params) {
  return request({
    url: category,
    method: 'put',
    data: params,
  })
}
