import axios from 'axios'
import qs from 'qs'
import jsonp from 'jsonp'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { YQL, CORS, prefix } from './config'

const fetch = (options) => {
  let { data, url } = options
  const method = options.method.toLowerCase() || 'get'
  const fetchType = options.fetchType

  const cloneData = lodash.cloneDeep(data)

  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    message.error(e.message)
  }

  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: `${qs.stringify(data)}&callback`,
        name: `jsonp_${new Date().getTime()}`,
        timeout: 4000,
      }, (error, result) => {
        if (error) reject(error)
        resolve({ statusText: 'OK', status: 200, data: result })
      })
    })
  } else if (fetchType === 'YQL') {
    url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${encodeURIComponent(qs.stringify(options.data))}'&format=json`
    data = null
  }

  const config = {
    withCredentials: true,
    headers: {
      authorization: `Bearer ${localStorage.getItem(`${prefix}token`)}`,
    },
  }

  switch (method) {
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

const request = (options = {}) => {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS'
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL'
      } else {
        options.fetchType = 'JSONP'
      }
    }
  }

  return fetch(options).then((response) => {
    const data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data
    return data
  }).catch((error) => {
    const { response } = error
    let msg
    if (response && response instanceof Object) {
      const { data, statusText } = response
      msg = data.message || statusText
    } else {
      msg = error.message || 'Network Error'
    }
    return { code: false, msg }
  })
}

export default request
