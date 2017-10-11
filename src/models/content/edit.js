import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import lodash from 'lodash'
import { query, create, update } from '../../services/content'
import * as category from '../../services/category'

export default {

  namespace: 'contentDetail',

  state: {
    content: {},
    tree: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/content-edit') {
          dispatch({ type: 'clear' })
          dispatch({ type: 'queryCategory', payload: location.query })
        }
        const match = pathToRegexp('/content-edit/:_id').exec(location.pathname)
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
            data: result,
          },
        })
      } else {
        throw data
      }
    },

    * queryCategory ({ payload }, { call, put }) {
      const data = yield call(category.query, payload)
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
      const { contentDetail } = yield select(_ => _)
      const { content } = contentDetail

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
      const { data } = payload
      return {
        ...state,
        content: data,
      }
    },

    queryCategorySuccess (state, { payload: tree }) {
      return {
        ...state,
        tree,
      }
    },

    clear (state) {
      return {
        ...state,
        content: {},
        tree: [],
      }
    },
  },
}
