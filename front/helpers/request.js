import 'isomorphic-unfetch'

import { isJson } from './valaditor'

const API_V1 = 'http://localhost:3030/api/v1/'

export default async function request(params) {
  let url
  , options = {}

  if (typeof params === 'string') {
    url = params
  } else if (isJson(params)) {
    url = params.url
    options = params.options
  } else {
    throw TypeError('Request params is error !')
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