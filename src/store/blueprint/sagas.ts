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

import {
  INITIALIZED,
  createBlueprint,
  createNode,
} from 'store/blueprint/types'
import { getNodeMap } from 'store/library/selectors'


function* initializeBlueprintSaga(): SagaIterator<void> {
  const blueprint = yield call(createBlueprint)
  const schemas = yield select(getNodeMap)
  const props = {
    uid: 'on-run',
    label: 'On Run',
    x: 25,
    y: 250,
  }
  const node = yield call(createNode, schemas['blueprint.On'], props)
  yield put(addBlueprint(blueprint, true))
  yield put(addNode(node))
}

function* initializeSaga(): SagaIterator<void> {
  yield put(initialize())
}

export function* blueprintSaga(): SagaIterator<void> {
  yield all([
    takeEvery(LIBRARY_LOADED, initializeSaga),
    takeEvery(INITIALIZED, initializeBlueprintSaga),
  ])
}
