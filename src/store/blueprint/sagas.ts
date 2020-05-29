import { SagaIterator } from 'redux-saga'
import {
  all,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects'
import { INITIALIZED as APP_INITIALIZED } from 'store/app/types'
import {
  clearSelection,
  deleteConnection,
  deleteNode,
  initialize,
} from 'store/blueprint/actions'
import {
  getSelectedNodes,
  getSelectedConnections,
} from 'store/blueprint/selectors'
import {
  SELECTION_DELETED,
} from 'store/blueprint/types'


function* initializeBlueprintSaga() {
  yield put(initialize())
}

function* deleteSelectionSaga() {
  const connections = yield select(getSelectedConnections)
  const nodes = yield select(getSelectedNodes)
  for (const conn of connections) {
    yield put(deleteConnection(
      conn.sourceNodeId,
      conn.sourceName,
      conn.targetNodeId,
      conn.targetName,
    ))
  }
  for (const node of nodes) {
    yield put(deleteNode(node.uid))
  }
  yield put(clearSelection())
}


export function* blueprintSaga(): SagaIterator<void> {
  yield all([
    takeEvery(APP_INITIALIZED, initializeBlueprintSaga),
    takeEvery(SELECTION_DELETED, deleteSelectionSaga),
  ])
}
