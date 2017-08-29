import { request, config } from '../utils'

const { api } = config
const { category, categories } = api

export async function query (params) {
  return request({
    url: category.replace('/:_id', ''),
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: category.replace('/:_id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: category,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: category,
    method: 'put',
    data: params,
  })
}

export async function multi (params) {
  return request({
    url: categories,
    method: 'post',
    data: params,
  })
}
