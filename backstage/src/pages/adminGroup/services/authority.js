import { request, config } from 'utils'

const { api } = config
const { authority } = api

export function query (params) {
  return request({
    url: authority,
    method: 'get',
    data: params,
  })
}
