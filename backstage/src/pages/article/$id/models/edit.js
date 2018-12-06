import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { model } from 'utils/model'
import { query, update } from '../../services/article'
import * as categorysService from '../../../category/services/categorys'

export default modelExtend(model, {

  namespace: 'articleDetail',

  state: {
    article: {},
    tree: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/article/:_id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryCategory', payload: location.query })
          dispatch({ type: 'query', payload: { _id: match[1] } })
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      const { code, result } = data
      if (code === '0000') {
        yield put({
          type: 'updateState',
          payload: {
            article: result,
          },
        })
      } else {
        throw data
      }
    },

    * queryCategory ({ payload }, { call, put }) {
      const data = yield call(categorysService.query, payload)
      const { code, result } = data
      if (code === '0000') {
        yield put({
          type: 'updateState',
          payload: {
            tree: result,
          },
        })
      } else {
        throw data
      }
    },

    * update ({ payload }, { call, put }) {
      const data = yield call(update, payload)
      const { code } = data
      if (code === '0000') {
        message.success('编辑完成')
        // 处理 edit 缓存
        yield put({
          type: 'updateState',
          payload: {
            tree: [],
            article: {},
          },
        })
        yield put(routerRedux.goBack())
      } else {
        throw data
      }
    },

  },
})
