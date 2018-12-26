/* global fetch */

import { delay } from 'redux-saga'
import {
  all, call, take,
} from 'redux-saga/effects'
// import es6promise from 'es6-promise'
import 'isomorphic-unfetch'

import { actionTypes } from './actions'

// es6promise.polyfill()

function* runClockSaga() {
  yield take(actionTypes.START_CLOCK)
  while (true) {
    yield call(delay, 1000)
  }
}

// function* loadDataSaga() {
//   try {
//     const res = yield fetch('https://jsonplaceholder.typicode.com/users')
//     const data = yield res.json()
//   } catch (err) {
//   }
// }

function* rootSaga() {
  yield all([
    call(runClockSaga),
    // takeLatest(actionTypes.LOAD_DATA, loadDataSaga),
  ])
}

export default rootSaga
