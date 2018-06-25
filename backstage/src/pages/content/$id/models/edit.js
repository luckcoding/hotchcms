import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import lodash from 'lodash'
import { query, create, update } from '../../services/content'
import * as categorysService from '../../../category/services/categorys'

export default {

  namespace: 'contentEdit',

  state: {
    content: {},
    tree: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/content/:_id').exec(location.pathname)
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
          type: 'querySuccess',
          payload: {
            content: result,
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
          type: 'queryCategorySuccess',
          payload: result,
        })
      } else {
        throw data
      }
    },

    * save ({ payload }, { select, call, put }) {
      const { contentEdit } = yield select(_ => _)
      const { content } = contentEdit

      const action = lodash.isEmpty(content) ? create : update
      const data = yield call(action, payload)
      const { code } = data
      if (code === '0000') {
        message.success('编辑完成')
        yield put(routerRedux.goBack())
      } else {
        throw data
      }
    },

  },

  reducers: {
    querySuccess (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    queryCategorySuccess (state, { payload: tree }) {
      return {
        ...state,
        tree,
      }
    },
  },
}
