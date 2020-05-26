import { SagaIterator } from 'redux-saga'
import {
  call,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects'
import {
  addConnection,
  clearConnection,
} from 'store/graph/actions'
import {
  getConnection,
  getDeltas,
  getNodes,
} from 'store/graph/selectors'
import {
  CONNECTION_STOPPED,
  GraphHotspot,
  GraphNode,
  Delta,
} from 'store/graph/types'


function findHotspot(
  x: number,
  y: number,
  nodes: Array<GraphNode>,
  deltas: Record<string, Delta>,
): GraphHotspot | undefined {
  for (const node of nodes) {
    const { dx, dy } = deltas[node.uid] || { dx: 0, dy: 0 }
    for (const hotspot of node.hotspots) {
      const hx = node.x + dx + hotspot.offsetX
      const hy = node.y + dy + hotspot.offsetY
      if (hx - 3 <= x && x <= hx + 3) {
        if (hy - 3 <= y && y <= hy + 3) {
          return hotspot
        }
      }
    }
  }
  return undefined
}


function* checkForConnection(): SagaIterator<void> {
  const connection = yield select(getConnection)
  const nodes = yield select(getNodes)
  const deltas = yield select(getDeltas)
  if (connection && connection.source) {
    const hotspot = yield call(
      findHotspot,
      connection.targetX || 0,
      connection.targetY || 0,
      nodes,
      deltas,
    )
    if (hotspot) {
      yield put(addConnection({
        source: connection.source,
        sourceOffsetX: connection.sourceOffsetX,
        sourceOffsetY: connection.sourceOffsetY,
        target: hotspot.uid,
        targetOffsetX: hotspot.offsetX,
        targetOffsetY: hotspot.offsetY,
      }))
    }
  } else if (connection && connection.target) {
    const hotspot = yield call(
      findHotspot,
      connection.sourceX || 0,
      connection.sourceY || 0,
      nodes,
      deltas,
    )
    if (hotspot) {
      yield put(addConnection({
        source: hotspot.uid,
        sourceOffsetX: hotspot.offsetX,
        sourceOffsetY: hotspot.offsetY,
        target: connection.target,
        targetOffsetX: connection.targetOffsetX,
        targetOffsetY: connection.targetOffsetY,
      }))
    }
  }
  yield put(clearConnection())
}

export function* graphSaga(): Generator {
  yield takeEvery(CONNECTION_STOPPED, checkForConnection)
}
