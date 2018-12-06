/* global window */
import modelExtend from 'dva-model-extend'
import { create, remove, update } from './services/adminUser'
import * as adminUsersService from './services/adminUsers'
import * as adminGroupsService from './services/adminGroups'
import { pageModel } from 'utils/model'
import config from 'utils/config'

const { query } = adminUsersService

export default modelExtend(pageModel, {
  namespace: 'adminUser',

  state: {
    currentItem: {},
    groupList: [],
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/adminUser') {
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

    * queryGroup ({ payload }, { call, put }) {
      const data = yield call(adminGroupsService.query, payload)
      if (data.code === '0000') {
        yield put({
          type: 'updateState',
          payload: {
            groupList: data.result,
          },
        })
      } else {
        throw data
      }
    },

    * delete ({ payload }, { call }) {
      const data = yield call(remove, { _id: payload })
      if (data.code !== '0000') {
        throw data
      }
    },

    * create ({ payload }, { call, put }) {
      payload.password = config.encrypted(payload.password)
      const data = yield call(create, payload)
      if (data.code === '0000') {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      payload.password = config.encrypted(payload.password)
      const _id = yield select(({ adminUser }) => adminUser.currentItem._id)
      const newadminUser = { ...payload, _id }
      const data = yield call(update, newadminUser)
      if (data.code === '0000') {
        yield put({ type: 'hideModal' })
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

  },
})
