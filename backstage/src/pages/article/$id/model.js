import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import { model } from 'utils/model'
import {
  queryArticle,
  updateArticle,
  queryCategoryList,
} from 'api'

export default modelExtend(model, {
  namespace: 'articleDetail',

  state: {
    detail: {},
    categoryList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/article/:_id', pathname)
        if (match) {
          dispatch({ type: 'queryCategoryList' })
          dispatch({ type: 'query', payload: { _id: match[1] } })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(queryArticle, payload)
      if (data.code === '0000') {
        yield put({
          type: 'updateState',
          payload: {
            detail: data.result,
          },
        })
      } else {
        throw data
      }
    },

    *queryCategoryList({ payload }, { call, put }) {
      const data = yield call(queryCategoryList, payload)
      if (data.code === '0000') {
        yield put({
          type: 'updateState',
          payload: {
            categoryList: data.result,
          },
        })
      } else {
        throw data
      }
    },

    *update({ payload }, { call, put }) {
      const data = yield call(updateArticle, payload)
      if (data.code === '0000') {
        message.success('编辑完成')
      } else {
        throw data
      }
    },

  },
})
