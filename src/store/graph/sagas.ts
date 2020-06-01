import _reduce from 'lodash/reduce'
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
  clearSuggestions,
  finishConnector,
  showSuggestions,
} from 'store/graph/actions'
import {
  Connection,
  Node,
  Hotspot,
  createConnection,
  createNode,
} from 'store/blueprint/types'
import {
  getNodes,
  getCurrentBlueprintId,
} from 'store/blueprint/selectors'
import { getNodes as getNodeSchemas } from 'store/library/selectors'
import {
  getConnector,
  getNodeDeltas,
} from 'store/graph/selectors'
import { NodeSchema } from 'store/library/types'
import {
  CONNECTOR_STOPPED,
  NODE_MOVE_FINISHED,
  NODE_SCHEMA_DROPPED,
  SUGGESTION_PICKED,
  DropNodeSchemaAction,
  FinishNodeMoveAction,
  ConnectorSuggestion,
  PickSuggestionAction,
  StopConnectorAction,
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


function makeSuggestions(
  schemas: Array<NodeSchema>,
  node: Node,
  connector: Connection,
): Array<ConnectorSuggestion> {
  const direction = connector.sourceNodeId ? 'input' : 'output'
  const isPort = !!node.ports[connector.sourceName || connector.targetName]
  return _reduce(
    schemas,
    (
      acc: Array<ConnectorSuggestion>,
      schema: NodeSchema,
    ): Array<ConnectorSuggestion> => {
      if (isPort) {
        for (const port of _values(schema.ports)) {
          if (port.direction === direction) {
            acc.push({
              schema,
              name: port.name,
            })
          }
        }
      } else if (direction === 'input') {
        for (const slot of schema.slots || []) {
          acc.push({ schema, name: slot })
        }
      } else {
        for (const signal of schema.signals || []) {
          acc.push({ schema, name: signal })
        }
      }
      return acc
    },
    [],
  )
}


function makeConnectionFromHotspot(
  connector: Connection,
  hotspot: Hotspot,
): Connection {
  const isSource = !!connector.sourceNodeId
  return createConnection({
    sourceNodeId: isSource ? connector.sourceNodeId : hotspot.nodeId,
    sourceName: isSource ? connector.sourceName : hotspot.name,
    sourcePos: {
      x: 0,
      y: 0,
      offsetX: isSource ? connector.sourcePos.offsetX : hotspot.offsetX,
      offsetY: isSource ? connector.sourcePos.offsetY : hotspot.offsetY,
    },
    sourcePlacement: isSource ? connector.sourcePlacement : hotspot.placement,
    targetNodeId: isSource ? hotspot.nodeId : connector.targetNodeId,
    targetName: isSource ? hotspot.name : connector.targetName,
    targetPos: {
      x: 0,
      y: 0,
      offsetX: isSource ? hotspot.offsetX : connector.targetPos.offsetX,
      offsetY: isSource ? hotspot.offsetY : connector.targetPos.offsetY,
    },
    targetPlacement: isSource ? hotspot.placement : connector.targetPlacement,
  })
}


function makeConnection(
  connector: Connection,
  nodes: Record<string, Node>,
): Connection | undefined {
  const { x, y } = connector.sourceNodeId ? connector.targetPos : connector.sourcePos
  const hotspot = getHotspot(nodes, x, y)
  if (hotspot) {
    return makeConnectionFromHotspot(connector, hotspot)
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


function* pickSuggestionSaga(action: PickSuggestionAction): SagaIterator<void> {
  const { suggestion } = action
  const connector = yield select(getConnector)
  if (connector) {
    const { x, y } = connector.sourceNodeId ? connector.targetPos : connector.sourcePos
    const node = yield call(createNode, suggestion.schema, { x, y })
    yield put(addNode(node))
    for (const hotspot of node.hotspots) {
      if (hotspot.name === suggestion.name) {
        const connection = yield call(makeConnectionFromHotspot, connector, hotspot)
        if (connection) {
          yield put(addConnection(connection))
        }
      }
    }
  }
  yield put(clearSuggestions())
}


function* maybeCreateConnectionSaga(action: StopConnectorAction): SagaIterator<void> {
  const { x, y } = action
  const connector = yield select(getConnector)
  const nodes = yield select(getNodes)
  if (connector) {
    const connection = yield call(makeConnection, connector, nodes)
    if (connection) {
      yield put(addConnection(connection))
    } else {
      const schemas = yield select(getNodeSchemas)
      const node = nodes[connector.sourceNodeId || connector.targetNodeId]
      const suggestions = yield call(makeSuggestions, schemas, node, connector)
      if (suggestions) {
        yield put(showSuggestions(suggestions, x, y))
        return
      }
    }
  }
  yield put(finishConnector())
}

export function* graphSaga(): SagaIterator<void> {
  yield all([
    takeEvery(CONNECTOR_STOPPED, maybeCreateConnectionSaga),
    takeEvery(NODE_SCHEMA_DROPPED, createNodeSaga),
    takeEvery(NODE_MOVE_FINISHED, finishNodeMoveSaga),
    takeEvery(SUGGESTION_PICKED, pickSuggestionSaga),
  ])
}
