import 'isomorphic-unfetch'
import qs from 'qs'
import { cloneDeep, isEmpty } from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { isJson } from './valaditor'
import config from './config'

const { getApiUrl } = config

/**
 * request('user')
 *
 * request('user', {name: 'zhangsan'})
 *
 * request('post user', {name: 'zhangsan'})
 *
 * request('put user/:_id', {_id: '1234'})
 *
 */

export default async function request(params, data) {
  if (typeof params !== 'string') {
    throw TypeError('Request params is error !')
  }

  let url
  let method = 'get'

  const paramsArray = params.split(' ')

  if (paramsArray.length === 2) {
    method = paramsArray[0]
    url = getApiUrl(paramsArray[1])
  } else {
    url = getApiUrl(params)
  }

  const cloneData = cloneDeep(data)

  try {
    let domain = ''
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (urlMatch) {
      ;[domain] = urlMatch
      url = url.slice(domain.length)
    }

    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    console.error(e.message)
  }

  if (['get', 'head'].includes(method.toLocaleLowerCase())) {
    url = `${url}${isEmpty(cloneData) ? '' : '?'}${qs.stringify(cloneData)}`
  }

  const res = await fetch(url, {
    method,
  })

  if (res.status !== 200) {
    throw Error('Network is error !')
  }

  const json = await res.json()
  if (json.code === '0000') {
    return json.result
  }
  throw Error(json.message || 'Services unknow error !')
}
