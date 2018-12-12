import { has, set, isNull, isObject } from 'lodash'
import md5 from 'md5'
import request from 'utils/request'
import { apiPrefix, secret } from 'utils/config'
import auth from 'utils/auth'

import routes from './routes'
import api from './api'

const encrypted = data => {
  if (has(data, 'password')) {
    set(data, 'password', md5(data.password + secret))
  }
  return data
}

/**
 * filter the empty params (not '')
 * @param  {Object} data [description]
 * @return {Object}      [description]
 */
const filterNull = data => {
  if (isObject(data)) {
    for (let key in data) {
      isNull(data[key]) && delete data[key]
    }
  }
  return data
}

const gen = params => {
  let url = apiPrefix + params
  let method = 'GET'

  const paramsArray = params.split(' ')
  if (paramsArray.length === 2) {
    method = paramsArray[0]
    url = apiPrefix + paramsArray[1]
  }

  return function(data) {
    return request({
      url,
      data: encrypted(filterNull(data)),
      method,
      headers: {
        authorization: auth.get(),
      },
    })
  }
}

const APIFunction = {}
for (const key in api) {
  APIFunction[key] = gen(api[key])
}

APIFunction.queryWeather = params => {
  params.key = 'i7sau1babuzwhycn'
  return request({
    url: `${apiPrefix}/weather/now.json`,
    data: params,
  })
}

APIFunction.queryRouteList = () => {
  return Promise.resolve(routes)
}

module.exports = APIFunction
