import pathToRegexp from 'path-to-regexp'
import { query } from '../../services/adminUser'

export default {

  namespace: 'adminUserDetail',

  state: {
    data: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/admin-user/:_id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { _id: match[1] } })
        }
      })
    },
  },

  effects: {
    * query ({
      payload,
    }, { call, put }) {
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
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data,
      }
    },
  },
}
