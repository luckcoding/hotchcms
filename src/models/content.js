import modelExtend from 'dva-model-extend'
import { _query } from '../services/content'
import { pageModel } from './common'

export default modelExtend(pageModel, {

  namespace: 'post',

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/content') {
          dispatch({ type: 'query',
            payload: {
              status: 1,
              ...location.query,
            } })
        }
      })
    },
  },

  effects: {
    * query ({
      payload,
    }, { call, put }) {
      const data = yield call(_query, payload)
      if (data.code === '0000') {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.result.list,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.result.total,
            },
          },
        })
      } else {
        throw data
      }
    },
  },
})
