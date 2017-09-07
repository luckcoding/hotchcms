import { request, config } from '../utils'

const { api } = config
const { siteInfo } = api

export async function query (params) {
  return request({
    url: siteInfo,
    method: 'get',
    data: params,
  })
}

export async function save (params) {
  return request({
    url: siteInfo,
    method: 'put',
    data: params,
  })
}
