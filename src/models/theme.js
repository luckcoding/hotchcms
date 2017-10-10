import { _query, create, remove } from '../services/theme'

export default {
  namespace: 'theme',

  state: {
    themeList: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/theme') {
          dispatch({ type: 'query' })
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(_query, payload)
      if (data.code === '0000') {
        yield put({
          type: 'querySuccess',
          payload: data.result,
        })
      } else {
        throw data
      }
    },

    * enable ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.code === '0000') {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * uninstall ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.code === '0000') {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

  },

  reducers: {
    querySuccess (state, { payload: themeList }) {
      return {
        ...state,
        themeList,
      }
    },

    onCheckItems (state, { payload: checkItems }) {
      return { ...state, checkItems }
    },

  },
}
