import { routerRedux } from 'dva/router'
import { login } from '../services/login'

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
  },
  reducers: {
    showLoginLoading (state) {
      return { ...state, loginLoading: true }
    },
    hideLoginLoading (state) {
      return { ...state, loginLoading: false }
    },
  },
  effects: {
    * login ({ payload }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      const data = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      if (data.code === '0000') {
        yield put({ type: 'app/setToken', payload: { token: data.result } })
        yield put({ type: 'app/query' })
        yield put(routerRedux.push('/dashboard'))
      } else {
        throw data
      }
    },
  },
  subscriptions: {

  },
}
