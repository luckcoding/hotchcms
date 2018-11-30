import 'isomorphic-unfetch'
import qs from 'qs'
import { isJson } from './valaditor'

const API_V1 = 'http://localhost:3030/api/v1/'

/**
 * request('user')
 * 
 * request('user', {name: 'zhangsan'})
 * 
 * request({
 *   url: 'user',
 *   options: {
 *     method: 'post',
 *     body: {
 *       password: '123'
 *     }
 *   }
 * })
 */

export default async function request(params, payload) {
  let url
  , options = {
    method: 'GET'
  }

  if (typeof params === 'string') {
    url = params
  } else if (isJson(params)) {
    url = params.url
    options = params.options
  } else {
    throw TypeError('Request params is error !')
  }

  if (isJson(payload) && ['get', 'head'].includes(options.method.toLowerCase())) {
    url = url + '?' + qs.stringify(payload)
  }

  const res = await fetch(`${API_V1}${url}`, options)

  if (res.status !== 200) {
    throw Error('Network is error !')
  }

  const json = await res.json()
  if (json.code === '0000') {
    return json.result
  } else {
    throw Error(json.message || 'Services unknow error !')
  }
}

export async function onlyResult(params) {
  try {
    const result = await request(params)
    return result
  } catch (e) {
    return {}
  }
}