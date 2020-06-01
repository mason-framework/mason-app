import _reduce from 'lodash/reduce'
import { v4 as uuid4 } from 'uuid'
import {
  all,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import {
  addConnection,
  addNode,
  deleteConnection,
  deleteNode,
} from 'store/blueprint/actions'
import { getConnections } from 'store/blueprint/selectors'
import {
  getSelectedConnections,
  getSelectedNodes,
  getCopiedNodes,
  getCopiedMode,
} from 'store/selection/selectors'
import {
  clearCopy,
  clearSelection,
} from 'store/selection/actions'
import {
  SELECTION_DELETED,
  SELECTION_PASTED,
} from 'store/selection/types'
import { Node, Port, Hotspot } from 'store/blueprint/types'


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

function* pasteSelectionSaga() {
  const connections = yield select(getConnections)
  const nodes = yield select(getCopiedNodes)
  const mode = yield select(getCopiedMode)
  for (const node of nodes) {
    if (mode === 'cut') {
      yield put(deleteNode(node.uid))
      yield put(addNode(node))
    } else {
      const uid = uuid4()
      const newNode: Node = {
        ...node,
        uid,
        signals: [...node.signals],
        slots: [...node.slots],
        ports: _reduce(node.ports, (acc: Record<string, Port>, port: Port) => {
          acc[port.name] = { ...port }
          return acc
        }, {}),
        hotspots: node.hotspots.map((hotspot: Hotspot) => ({
          ...hotspot,
          nodeId: uid,
        })),
        x: node.x + 10,
        y: node.y + 10,
      }
      yield put(addNode(newNode))
      for (const conn of connections) {
        if (conn.sourceNodeId === node.uid) {
          yield put(addConnection({
            ...conn,
            sourceNodeId: newNode.uid,
          }))
        } else if (conn.targetNodeId === node.uid) {
          yield put(addConnection({
            ...conn,
            targetNodeId: newNode.uid,
          }))
        }
      }
    }
  }
  if (mode === 'cut') {
    yield put(clearCopy())
  }
}


export function* selectionSaga(): SagaIterator<void> {
  yield all([
    takeEvery(SELECTION_DELETED, deleteSelectionSaga),
    takeEvery(SELECTION_PASTED, pasteSelectionSaga),
  ])
}
