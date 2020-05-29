import _values from 'lodash/values'
import { SagaIterator } from 'redux-saga'
import {
  all,
  call,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects'
import {
  addNode,
  addConnection,
  changeNode,
} from 'store/blueprint/actions'
import {
  clearNodeDelta,
  finishConnector,
} from 'store/graph/actions'
import {
  Connection,
  Node,
  Hotspot,
  createNode,
} from 'store/blueprint/types'
import {
  getNodes,
  getCurrentBlueprintId,
} from 'store/blueprint/selectors'
import {
  getConnector,
  getNodeDeltas,
} from 'store/graph/selectors'
import {
  CONNECTOR_STOPPED,
  NODE_MOVE_FINISHED,
  NODE_SCHEMA_DROPPED,
  DropNodeSchemaAction,
  FinishNodeMoveAction,
} from 'store/graph/types'


const HOTSPOT_AREA = 6


function getHotspot(nodes: Record<string, Node>, x: number, y: number): Hotspot | undefined {
  for (const node of _values(nodes)) {
    for (const hotspot of node.hotspots) {
      const hx = node.x + hotspot.offsetX
      const hy = node.y + hotspot.offsetY
      if (hx - HOTSPOT_AREA <= x && x <= hx + HOTSPOT_AREA) {
        if (hy - HOTSPOT_AREA <= y && y <= hy + HOTSPOT_AREA) {
          return hotspot
        }
      }
    }
  }
  return undefined
}


function makeConnection(
  connector: Connection,
  nodes: Record<string, Node>,
): Connection | undefined {
  if (connector.sourceNodeId) {
    const { x, y } = connector.targetPos
    const hotspot = getHotspot(nodes, x, y)
    if (hotspot) {
      return {
        ...connector,
        targetNodeId: hotspot.nodeId,
        targetName: hotspot.name,
        targetPos: {
          x: 0,
          y: 0,
          offsetX: hotspot.offsetX,
          offsetY: hotspot.offsetY,
        },
        targetPlacement: hotspot.placement,
      }
    }
  }
  if (connector.targetNodeId) {
    const { x, y } = connector.sourcePos
    const hotspot = getHotspot(nodes, x, y)
    if (hotspot) {
      return {
        ...connector,
        sourceNodeId: hotspot.nodeId,
        sourceName: hotspot.name,
        sourcePos: {
          x: 0,
          y: 0,
          offsetX: hotspot.offsetX,
          offsetY: hotspot.offsetY,

        },
        sourcePlacement: hotspot.placement,
      }
    }
  }
  return undefined
}


function* createNodeSaga(action: DropNodeSchemaAction): SagaIterator<void> {
  const { schema, x, y } = action
  const node = yield call(createNode, schema, { x, y })
  yield put(addNode(node))
}


function* finishNodeMoveSaga(action: FinishNodeMoveAction): SagaIterator<void> {
  const { uid } = action
  const deltas = yield select(getNodeDeltas)
  const nodes = yield select(getNodes)
  const blueprintId = yield select(getCurrentBlueprintId)
  const node = nodes[uid]
  if (node) {
    const { dx, dy } = deltas[uid] || { dx: 0, dy: 0 }
    if (dx || dy) {
      yield put(changeNode(uid, { x: node.x + dx, y: node.y + dy, blueprintId }))
    }
  }
  yield put(clearNodeDelta(uid))
}


function* maybeCreateConnectionSaga(): SagaIterator<void> {
  const connector = yield select(getConnector)
  const nodes = yield select(getNodes)
  if (connector) {
    const connection = yield call(makeConnection, connector, nodes)
    if (connection) {
      yield put(addConnection(connection))
    }
  }
  yield put(finishConnector())
}

export function* graphSaga(): SagaIterator<void> {
  yield all([
    takeEvery(CONNECTOR_STOPPED, maybeCreateConnectionSaga),
    takeEvery(NODE_SCHEMA_DROPPED, createNodeSaga),
    takeEvery(NODE_MOVE_FINISHED, finishNodeMoveSaga),
  ])
}
