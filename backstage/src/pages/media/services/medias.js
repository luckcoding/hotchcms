import { request, config } from 'utils'

const { api } = config
const { media } = api

export function query (params) {
  return request({
    url: media.replace('/:_id', ''),
    method: 'get',
    data: params,
  })
}

export function multi (params) {
  return request({
    url: media.replace('/:_id', '/multi'),
    method: 'post',
    data: params,
  })
}
