import { router, pathMatchRegexp, auth } from 'utils'
import { loginUser } from 'api'

export default {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { put, call, select }) {
      // handle account type
      if (/^\d{11}$/.test(payload.account)) {
        payload.mobile = payload.account
      } else {
        payload.email = payload.account
      }
      delete payload.account

      const data = yield call(loginUser, payload)
      const { locationQuery } = yield select(_ => _.app)
      if (data.code === '0000') {
        auth.set(data.result)

        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (!pathMatchRegexp('/login', from)) {
          if (from === '/') router.push('/dashboard')
          else router.push(from)
        } else {
          router.push('/dashboard')
        }
      } else {
        throw data
      }
    },
  },
}
