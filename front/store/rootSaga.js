/* global fetch */

import {delay} from 'redux-saga'
import {all, call, put, take, takeLatest} from 'redux-saga/effects'
// import es6promise from 'es6-promise'
import 'isomorphic-unfetch'

import {actionTypes, failure, loadDataSuccess, tickClock} from './actions'

// es6promise.polyfill()

function * runClockSaga () {
  console.log('11=====>>>>>>>>>>>')
  yield take(actionTypes.START_CLOCK)
  console.log('=====>>>')
  while (true) {
    console.log('run')
    yield call(delay, 1000)
  }
}

function * loadDataSaga () {
  try {
    const res = yield fetch('https://jsonplaceholder.typicode.com/users')
    const data = yield res.json()
    console.log('Yes')
  } catch (err) {
    console.log('err')
  }
}

function * rootSaga () {
  yield all([
    call(runClockSaga),
    takeLatest(actionTypes.LOAD_DATA, loadDataSaga)
  ])
}

export default rootSaga
