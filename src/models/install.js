import { redis, database } from '../services/install'

export default {
  namespace: 'install',
  state: {
    redisData: {},
    mongodbData: {},
    settingData: {},
    step: 0,
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
  },

  reducers: {

    nextStep (state, { payload }) {
      return { ...state, ...payload }
    },

  },
}
