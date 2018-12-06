import { request, config } from 'utils'

const { api } = config
const { adminGroup } = api

export function query (params) {
  return request({
    url: adminGroup.replace('/:_id', '/all'),
    method: 'get',
    data: params,
  })
}
