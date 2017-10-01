import pathToRegexp from 'path-to-regexp'
import { query } from '../../services/content'
import * as category from '../../services/category'
import { config } from '../../utils'

const { routePrefix } = config

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
          dispatch({
            type: 'queryCategory',
            payload: location.query,
          })
        }
        const match = pathToRegexp(`${routePrefix}/admin-user/:_id`).exec(location.pathname)
        if (match) {
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
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data,
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
