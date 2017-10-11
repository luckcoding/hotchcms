import { request, config } from '../utils'

const { api } = config
const { content, contents } = api

export async function query (params) {
  return request({
    url: content,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: content.replace('/:_id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: content,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: content,
    method: 'put',
    data: params,
  })
}

/**
 * =========== list ===========
 */

export async function _query (params) {
  return request({
    url: content.replace('/:_id', ''),
    method: 'get',
    data: params,
  })
}

export async function multi (params) {
  return request({
    url: contents,
    method: 'post',
    data: params,
  })
}