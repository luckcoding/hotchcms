import { query, save } from './services/setting'

export default {
  namespace: 'setting',

  state: {
    siteInfo: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/setting') {
          dispatch({ type: 'query' })
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (data.code === '0000') {
        yield put({
          type: 'querySuccess',
          payload: data.result,
        })
      } else {
        throw data
      }
    },

    * save ({ payload }, { call, put }) {
      const data = yield call(save, payload)
      if (data.code === '0000') {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

  },

  reducers: {
    querySuccess (state, { payload: siteInfo }) {
      return {
        ...state,
        siteInfo,
      }
    },

    onCheckItems (state, { payload: checkItems }) {
      return { ...state, checkItems }
    },

  },
}
