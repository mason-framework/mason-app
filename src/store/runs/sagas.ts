import { SagaIterator } from 'redux-saga'
import {
  all,
  put,
  select,
  call,
  takeEvery,
} from 'redux-saga/effects'

import * as api from 'store/runs/api'
import { openWorkflow } from 'store/app/actions'
import { getPresent } from 'store/blueprint/selectors'
import { getLevel as getLogLevel } from 'store/logs/selectors'
import {
  RUN_STARTED,
  StartRunAction,
} from 'store/runs/types'


function* startRunSaga({ uid, inputs }: StartRunAction) {
  yield put(openWorkflow())
  const level = yield select(getLogLevel)
  const state = yield select(getPresent)
  const bp = yield call(api.createBlueprint, state)
  if (bp) {
    const action = yield call(api.runBlueprint, bp, uid, inputs, level)
    yield put(action)
  }
}

export function* runsSaga(): SagaIterator<void> {
  yield all([
    takeEvery(RUN_STARTED, startRunSaga),
  ])
}
