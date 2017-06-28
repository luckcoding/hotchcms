// import { myCity, queryWeather, query } from '../services/dashboard'
// import { parse } from 'qs'
import { color } from '../utils/theme'

export default {
  namespace: 'dashboard',
  state: {
    sales: [],
    quote: {
      avatar: 'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
    },
    numbers: [
      {
        icon: 'team',
        color: color.green,
        title: '用户数量',
        number: 2781,
      }, {
        icon: 'team',
        color: color.blue,
        title: '新增用户',
        number: 3241,
      }, {
        icon: 'message',
        color: color.purple,
        title: '活跃讨论',
        number: 253,
      }, {
        icon: 'shopping-cart',
        color: color.red,
        title: 'Referrals',
        number: 4324,
      },
    ],
    recentSales: [],
    comments: [],
    completed: [],
    browser: [],
    cpu: {},
    user: {
      avatar: 'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
    },
  },
  subscriptions: {
    // setup ({ dispatch }) {
    //   dispatch({ type: 'query' })
    // },
  },
  effects: {
    // *query ({ payload }, { call, put }) {
    //   const data = yield call(query, parse(payload))
    //   yield put({ type: 'queryWeather', payload: { ...data } })
    // },
  },
}
