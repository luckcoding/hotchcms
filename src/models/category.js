import { query, create, update, multi } from '../services/category'

export default {
  namespace: 'category',

  state: {
    tree: [],
    currentItem: {},
    checkItems: [],
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

    * multiDelete ({ payload }, { call, put, select }) {
      const { checkItems } = yield select(_ => _.category)

      const data = yield call(multi, { type: 'remove', multi: checkItems })
      if (data.code === '0000') {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.code === '0000') {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const _id = yield select(({ category }) => category.currentItem._id)
      const newCategory = { ...payload, _id }
      const data = yield call(update, newCategory)
      if (data.code === '0000') {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

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

    onCheckItems (state, { payload: checkItems }) {
      return { ...state, checkItems }
    },

  },
}
