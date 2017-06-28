import { routerRedux } from 'dva/router'
import { login, getCaptcha } from '../services/login'

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
    captcha: '',
  },
  reducers: {
    showLoginLoading (state) {
      return { ...state, loginLoading: true }
    },
    hideLoginLoading (state) {
      return { ...state, loginLoading: false }
    },
    setCaptchaData (state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    * login ({ payload }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      const data = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      if (data.code === '0000') {
        yield put({ type: 'app/query' })
        yield put(routerRedux.push('/dashboard'))
      } else {
        throw data
      }
    },

    * captcha ({ payload = {} }, { put, call }) {
      const data = yield call(getCaptcha)
      if (data.code === '0000') {
        yield put({ type: 'setCaptchaData', payload: { captcha: data.result } })
      } else {
        throw data
      }
    },
  },
  subscriptions: {
    setup ({ dispatch }) {
      dispatch({ type: 'captcha' })
    },
  },
}
