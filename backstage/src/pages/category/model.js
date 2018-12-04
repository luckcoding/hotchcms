/* global window */
import { create, update, remove } from './services/category'
import * as categorysService from './services/categorys'

const { query, multi } = categorysService

export default {
  namespace: 'category',

  state: {
    list: [],
    currentItem: {},
    checkItems: [],
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/category') {
          const payload = location.query
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.code === '0000') {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.result,
          },
        })
      } else {
        throw data
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { _id: payload })
      const { selectedRowKeys } = yield select(_ => _.category)
      if (data.code === '0000') {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * multiDelete ({ payload }, { select, call, put }) {
      const { checkItems } = yield select(_ => _.category)

      const data = yield call(multi, { type: 'remove', multi: checkItems, ...payload })
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

    querySuccess (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
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
