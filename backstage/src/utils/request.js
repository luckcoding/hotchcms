/* global window */
import axios from 'axios'
import cloneDeep from 'lodash.clonedeep'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import auth from './auth'

const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
    headers = {},
  } = options

  const cloneData = cloneDeep(data)

  try {
    let domain = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      [domain] = url.match(/[a-zA-z]+:\/\/[^/]*/)
      url = url.slice(domain.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    message.error(e.message)
  }

  const config = {
    withCredentials: true,
    headers: {
      ...headers,
      authorization: auth.get(),
    },
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
        ...config,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
        ...config,
      })
    case 'post':
      return axios.post(url, cloneData, {
        ...config,
      })
    case 'put':
      return axios.put(url, cloneData, {
        ...config,
      })
    case 'patch':
      return axios.patch(url, cloneData, {
        ...config,
      })
    default:
      return axios(options)
  }
}

export default function request (options) {

  return fetch(options)
    .then(response => Promise.resolve(response.data))
    .catch((error) => {
      const { response } = error
      let msg
      if (response && response instanceof Object) {
        const { data, statusText } = response
        msg = data.message || statusText
      } else {
        msg = error.message || 'Network Error'
      }

      /* eslint-disable */
      return Promise.resolve({ code: false, msg })
    })
}
