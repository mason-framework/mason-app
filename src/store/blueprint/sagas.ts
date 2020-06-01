import { SagaIterator } from 'redux-saga'
import {
  all,
  put,
  select,
  call,
  takeEvery,
} from 'redux-saga/effects'
import { LIBRARY_LOADED } from 'store/library/types'
import {
  addNode,
  addBlueprint,
  initialize,
} from 'store/blueprint/actions'

import * as api from 'store/blueprint/api'
import {
  openWorkflow,
} from 'store/app/actions'
import {
  getPresent,
} from 'store/blueprint/selectors'
import {
  BLUEPRINT_EXECUTED,
  INITIALIZED,
  createBlueprint,
  createNode,
} from 'store/blueprint/types'
import { getLevel as getLogLevel } from 'store/logs/selectors'
import { getNodeMap } from 'store/library/selectors'


function* executeBlueprintSaga() {
  yield put(openWorkflow())
  const level = yield select(getLogLevel)
  const state = yield select(getPresent)
  yield call(api.executeBlueprint, 'http://localhost:8000', state, level)
}

function* initializeBlueprintSaga() {
  const blueprint = yield call(createBlueprint)
  const schemas = yield select(getNodeMap)
  const props = { label: 'On Run', x: 25, y: 250 }
  const node = yield call(createNode, schemas['blueprint.On'], props)
  yield put(addBlueprint(blueprint, true))
  yield put(addNode(node))
}

function* initializeSaga() {
  yield put(initialize())
}

export function* blueprintSaga(): SagaIterator<void> {
  yield all([
    takeEvery(LIBRARY_LOADED, initializeSaga),
    takeEvery(INITIALIZED, initializeBlueprintSaga),
    takeEvery(BLUEPRINT_EXECUTED, executeBlueprintSaga),
  ])
}
