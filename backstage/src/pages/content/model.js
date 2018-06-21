/* global window */
import modelExtend from 'dva-model-extend'
import * as contentsService from './services/contents'
import { pageModel } from 'utils/model'

const { query, multi } = contentsService

export default modelExtend(pageModel, {
  namespace: 'content',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/content') {
          const payload = location.query || { page: 1, pageSize: 10 }
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

    // * delete ({ payload }, { call, put, select }) {
    //   const data = yield call(remove, { _id: payload })
    //   const { selectedRowKeys } = yield select(_ => _.content)
    //   if (data.code === '0000') {
    //     yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
    //     yield put({ type: 'query' })
    //   } else {
    //     throw data
    //   }
    // },

    * multiDelete ({ payload }, { call, put }) {
      const data = yield call(multi, { type: 'remove', ...payload })
      if (data.code === '0000') {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      } else {
        throw data
      }
    },

    // * create ({ payload }, { call, put }) {
    //   const data = yield call(create, payload)
    //   if (data.code === '0000') {
    //     yield put({ type: 'hideModal' })
    //     yield put({ type: 'query' })
    //   } else {
    //     throw data
    //   }
    // },

    // * update ({ payload }, { select, call, put }) {
    //   const _id = yield select(({ content }) => content.currentItem._id)
    //   const newcontent = { ...payload, _id }
    //   const data = yield call(update, newcontent)
    //   if (data.code === '0000') {
    //     yield put({ type: 'hideModal' })
    //     yield put({ type: 'query' })
    //   } else {
    //     throw data
    //   }
    // },

  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },
})
