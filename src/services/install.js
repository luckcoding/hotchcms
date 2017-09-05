import { request, config } from '../utils'

const { api } = config
const { install, testDatabase, testRedis } = api

/**
 * 安装状态
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export async function query (params) {
  return request({
    url: install,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: install,
    method: 'post',
    data: params,
  })
}

export async function redis (params) {
  return request({
    url: testRedis,
    method: 'put',
    data: params,
  })
}

export async function database (params) {
  return request({
    url: testDatabase,
    method: 'put',
    data: params,
  })
}
