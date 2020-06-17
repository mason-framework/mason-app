import { SagaIterator } from 'redux-saga'
import {
  all,
  put,
  call,
  select,
  takeEvery,
} from 'redux-saga/effects'
import * as api from 'store/storage/api'
import {
  getNodes,
  getConnections,
} from 'store/blueprint/selectors'
import { loadBlueprint } from 'store/blueprint/actions'
import { getNodeMap } from 'store/library/selectors'
import {
  createUi,
  createServerBlueprint,
  loadServerBlueprint,
} from 'store/blueprint/io'
import {
  STORAGE_MODAL_OPEN,
  STORAGE_MODAL_SAVE,
  BLUEPRINT_SAVED,
  BLUEPRINT_OPENED,
  OpenBlueprintAction,
  SaveBlueprintAction,
} from 'store/storage/types'
import { loadStorage, closeStorageModal } from 'store/storage/actions'


function* loadStorageSaga(): SagaIterator<void> {
  const items = yield call(api.getItems)
  yield put(loadStorage(items))
}

function* openBlueprintSaga(action: OpenBlueprintAction): SagaIterator<void> {
  const { path } = action
  const info = yield call(api.loadBlueprint, path)
  const schemas = yield select(getNodeMap)
  const state = yield call(loadServerBlueprint, schemas, info.blueprint, info.extras.ui)
  yield put(loadBlueprint(state))
  yield put(closeStorageModal())
}


function* saveBlueprintSaga(action: SaveBlueprintAction): SagaIterator<void> {
  const { path } = action
  const nodes = yield select(getNodes)
  if (nodes) {
    const connections = yield select(getConnections)
    const blueprint = yield call(createServerBlueprint, nodes, connections)
    const ui = yield call(createUi, nodes, connections)
    yield call(api.saveBlueprint, path, blueprint, ui)
  }
  yield put(closeStorageModal())
}


export function* storageSaga(): SagaIterator<void> {
  yield all([
    takeEvery([STORAGE_MODAL_OPEN, STORAGE_MODAL_SAVE], loadStorageSaga),
    takeEvery(BLUEPRINT_OPENED, openBlueprintSaga),
    takeEvery(BLUEPRINT_SAVED, saveBlueprintSaga),
  ])
}
