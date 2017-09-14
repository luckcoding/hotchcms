import { request, config } from '../utils'

const { api } = config
const { theme } = api

export async function create (params) {
  return request({
    url: theme.replace('/:_id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: theme,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: theme,
    method: 'put',
    data: params,
  })
}

/**
 * =========== list ===========
 */

export async function _query (params) {
  return request({
    url: theme.replace('/:_id', ''),
    method: 'get',
    data: params,
  })
}
