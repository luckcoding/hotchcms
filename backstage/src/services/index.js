import { has, set, isNull, isObject } from 'lodash'
import md5 from 'md5'
import request from 'utils/request'
import { apiPrefix, secret } from 'utils/config'
import auth from 'utils/auth'

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
  return Promise.resolve([
    {
      id: '1',
      icon: 'dashboard',
      name: 'Dashboard',
      zhName: '仪表盘',
      route: '/dashboard',
    },
    {
      id: '2',
      name: 'System',
      zhName: '系统',
      icon: 'setting',
    },
    {
      id: '21',
      breadcrumbParentId: '1',
      menuParentId: '2',
      name: 'Management user',
      zhName: '管理员',
      icon: 'user',
      route: '/adminUser',
    },
    {
      id: '22',
      breadcrumbParentId: '1',
      menuParentId: '2',
      name: 'Management group',
      zhName: '管理组',
      icon: 'team',
      route: '/adminGroup',
    },
    {
      id: '3',
      name: 'Content',
      zhName: '内容',
      icon: 'file-text',
    },
    {
      id: '31',
      breadcrumbParentId: '1',
      menuParentId: '3',
      name: 'Category',
      zhName: '分类',
      icon: 'filter',
      route: '/category',
    },
    {
      id: '32',
      breadcrumbParentId: '1',
      menuParentId: '3',
      name: 'Article',
      zhName: '文章',
      icon: 'file-text',
      route: '/article',
    },
    {
      id: '33',
      breadcrumbParentId: '1',
      menuParentId: '-1',
      name: 'Article Edit',
      zhName: '文章编辑',
      route: '/article/:_id',
    },
    {
      id: '34',
      breadcrumbParentId: '1',
      menuParentId: '3',
      name: 'Media',
      zhName: '资源',
      icon: 'cloud',
      route: '/media',
    },
    {
      id: '9',
      breadcrumbParentId: '1',
      name: 'Request',
      zhName: 'Request',
      icon: 'api',
      route: '/request',
    },
  ])
}

module.exports = APIFunction
