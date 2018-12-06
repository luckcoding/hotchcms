import { request, config } from 'utils'

const { api } = config
const { article } = api

export function query (params) {
  return request({
    url: article.replace('/:_id', ''),
    method: 'get',
    data: params,
  })
}

export function multi (params) {
  return request({
    url: article.replace('/:_id', '/multi'),
    method: 'post',
    data: params,
  })
}
