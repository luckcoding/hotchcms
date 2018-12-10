import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { pathMatchRegexp } from 'utils'
import {
  queryArticleList,
  createArticle,
  removeArticle,
  removeArticleList,
} from 'api'
import { pageModel } from 'utils/model'

export default modelExtend(pageModel, {
  namespace: 'article',

  state: {
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/article', location.pathname)) {
          dispatch({
            type: 'query',
            payload: {
              status: 1,
              ...location.query,
            },
          })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(queryArticleList, payload)
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

    *delete({ payload }, { call, put, select }) {
      const data = yield call(removeArticle, { _id: payload })
      const { selectedRowKeys } = yield select(_ => _.article)
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

    *multiDelete({ payload }, { call, put }) {
      const data = yield call(removeArticleList, payload)
      if (data.code === '0000') {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      } else {
        throw data
      }
    },

    *create({ payload }, { call, put }) {
      const data = yield call(createArticle, payload)
      if (data.code === '0000') {
        yield put(
          routerRedux.push({
            pathname: `/article/${data.result._id}`,
          })
        )
      } else {
        throw data
      }
    },
  },
})
