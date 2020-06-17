import { SagaIterator } from 'redux-saga'
import {
  all,
  put,
  select,
  call,
  takeEvery,
} from 'redux-saga/effects'

import * as api from 'store/runs/api'
import { createServerBlueprint } from 'store/blueprint/io'
import { openWorkflow } from 'store/app/actions'
import { getNodes, getConnections } from 'store/blueprint/selectors'
import { getLevel as getLogLevel } from 'store/logs/selectors'
import {
  RUN_STARTED,
  StartRunAction,
} from 'store/runs/types'


function* startRunSaga({ uid, inputs }: StartRunAction) {
  yield put(openWorkflow())
  const level = yield select(getLogLevel)
  const nodes = yield select(getNodes)
  if (nodes) {
    const connections = yield select(getConnections)
    const bp = yield call(createServerBlueprint, nodes, connections)
    const action = yield call(api.runBlueprint, bp, uid, inputs, level)
    yield put(action)
  }
}

export function* runsSaga(): SagaIterator<void> {
  yield all([
    takeEvery(RUN_STARTED, startRunSaga),
  ])
}
