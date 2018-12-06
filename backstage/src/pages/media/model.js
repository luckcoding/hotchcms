/* global window */
import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as categorysService from './services/medias'

const { query, multi } = categorysService

export default modelExtend(pageModel, {
  namespace: 'media',

  state: {
    currentItem: {},
    checkItems: [],
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/media') {
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

    * multiDelete ({ payload }, { select, call, put }) {
      const { checkItems } = yield select(_ => _.media)

      const data = yield call(multi, { type: 'remove', multi: checkItems, ...payload })
      if (data.code === '0000') {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

  },

  reducers: {

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
})
