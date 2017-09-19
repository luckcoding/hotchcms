import md5 from 'blueimp-md5'
import { redis, database, create } from '../services/install'

export default {
  namespace: 'install',
  state: {
    redisData: {},
    mongodbData: {},
    settingData: {},
    step: 0,
    loginLoading: false,
  },

  effects: {
    * database ({ payload }, { put, call }) {
      const data = yield call(database, payload)
      if (data.code === '0000') {
        yield put({
          type: 'nextStep',
          payload: {
            mongodbData: payload,
            step: 1,
          },
        })
      } else {
        throw data
      }
    },

    * redis ({ payload }, { put, call }) {
      const data = yield call(redis, payload)
      if (data.code === '0000') {
        yield put({
          type: 'nextStep',
          payload: {
            redisData: payload,
            step: 2,
          },
        })
      } else {
        throw data
      }
    },

    * install ({ payload }, { put, call, select }) {
      yield put({ type: 'showLoginLoading' })
      const { redisData, mongodbData } = yield select(_ => _.install)

      if (mongodbData.host) payload.dbHost = mongodbData.host
      if (mongodbData.port) payload.dbPort = mongodbData.port
      if (mongodbData.db) payload.db = mongodbData.db
      if (mongodbData.user) payload.dbUser = mongodbData.user
      if (mongodbData.pass) payload.dbPassword = mongodbData.pass

      if (redisData.host) payload.rdHost = redisData.host
      if (redisData.port) payload.rdPort = redisData.port
      if (redisData.db) payload.rdDb = redisData.db
      if (redisData.family) payload.rdFamily = redisData.family
      if (redisData.pass) payload.rdPass = redisData.pass

      payload.password = md5(payload.password)

      const data = yield call(create, payload)
      yield put({ type: 'hideLoginLoading' })
      if (data.code === '0000') {
        yield put({
          type: 'nextStep',
          payload: {
            step: 3,
          },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {

    nextStep (state, { payload }) {
      return { ...state, ...payload }
    },

    showLoginLoading (state) {
      return { ...state, loginLoading: true }
    },

    hideLoginLoading (state) {
      return { ...state, loginLoading: false }
    },

  },
}
