/* global window */
import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import {
  queryAdminUserList,
  createAdminUser,
  removeAdminUser,
  updateAdminUser,
  queryAllAdminGroupList,
} from 'api'
import { pageModel } from 'utils/model'

export default modelExtend(pageModel, {
  namespace: 'adminUser',

  state: {
    currentItem: {},
    allAdminGroupList: [],
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/adminUser', location.pathname)) {
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
    *query({ payload = {} }, { call, put }) {
      const data = yield call(queryAdminUserList, payload)
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

    *queryAllAdminGroupList({ payload }, { call, put }) {
      const data = yield call(queryAllAdminGroupList, payload)
      if (data.code === '0000') {
        yield put({
          type: 'updateState',
          payload: {
            allAdminGroupList: data.result,
          },
        })
      } else {
        throw data
      }
    },

    *delete({ payload }, { call, put, select }) {
      const data = yield call(removeAdminUser, { _id: payload })
      const { selectedRowKeys } = yield select(_ => _.adminUser)
      if (data.code === '0000') {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload),
          },
        })
      } else {
        throw data
      }
    },

    *create({ payload }, { call, put }) {
      const data = yield call(createAdminUser, payload)
      if (data.code === '0000') {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const _id = yield select(({ adminUser }) => adminUser.currentItem._id)
      const newAdminUser = { ...payload, _id }
      const data = yield call(updateAdminUser, newAdminUser)
      if (data.code === '0000') {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },
  },
})
