import { request, config } from 'utils'

const { api } = config
const { article } = api

export function query (params) {
  return request({
    url: article,
    method: 'get',
    data: params,
  })
}

export function create (params) {
  return request({
    url: article.replace('/:_id', ''),
    method: 'post',
    data: params,
  })
}

export function remove (params) {
  return request({
    url: article,
    method: 'delete',
    data: params,
  })
}

export function update (params) {
  return request({
    url: article,
    method: 'put',
    data: params,
  })
}
