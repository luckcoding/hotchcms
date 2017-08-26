import { query } from '../services/category'

export default {
  namespace: 'category',

  state: {
    tree: [],
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup ({ dispatch }) {
      dispatch({
        type: 'query',
        payload: location.query,
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

    // * delete ({ payload }, { call, put, select }) {
    //   // const data = yield call(remove, { _id: payload })
    //   // const { selectedRowKeys } = yield select(_ => _.adminUser)
    //   // if (data.code === '0000') {
    //   //   yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
    //   //   yield put({ type: 'query' })
    //   // } else {
    //   //   throw data
    //   // }
    // },

    // * create ({ payload }, { call, put }) {

    // },

    // * update ({ payload }, { select, call, put }) {

    // },

  },

  reducers: {
    querySuccess (state, { payload: tree }) {
      return {
        ...state,
        tree,
      }
    },

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },
}
