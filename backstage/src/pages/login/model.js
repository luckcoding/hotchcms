import { routerRedux } from 'dva/router'
import md5 from 'blueimp-md5'
import { auth } from 'utils'
import { login } from './service'

export default {
  namespace: 'login',

  state: {},

  effects: {
    * login ({
      payload,
    }, { put, call, select }) {
      if (/^\d{11}$/.test(payload.account)) {
        payload.mobile = payload.account
      } else {
        payload.email = payload.account
      }
      delete payload.account
      payload.password = md5(payload.password)
      const data = yield call(login, payload)
      const { locationQuery } = yield select(_ => _.app)
      if (data.code === '0000') {
        auth.set(data.result)
        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw data
      }
    },
  },

}
