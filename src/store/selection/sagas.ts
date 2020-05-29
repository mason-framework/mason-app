import { all, put, select, takeEvery } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import {
  deleteConnection,
  deleteNode,
} from 'store/blueprint/actions'
import {
  getSelectedConnections,
  getSelectedNodes,
} from 'store/selection/selectors'
import {
  clearSelection,
} from 'store/selection/actions'
import {
  SELECTION_DELETED,
} from 'store/selection/types'


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


export function* selectionSaga(): SagaIterator<void> {
  yield all([
    takeEvery(SELECTION_DELETED, deleteSelectionSaga),
  ])
}
