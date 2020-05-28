import { v4 as uuid4 } from 'uuid'
import _startCase from 'lodash/startCase'
import _camelCase from 'lodash/camelCase'
import { SagaIterator } from 'redux-saga'
import {
  call,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects'
import {
  addNode as addBlueprintNode,
  deleteNode as deleteBlueprintNode,
} from 'store/blueprint/actions'
import {
  addConnection,
  addNode as addGraphNode,
  clearGraph,
  finishConnector,
  deleteConnection,
  deleteNode as deleteGraphNode,
  clearSelection,
} from 'store/graph/actions'
import {
  getConnector,
  getNodes,
  getSelection,
} from 'store/graph/selectors'
import {
  Node,
  Port,
} from 'store/blueprint/types'
import { FILE_INITIALIZED } from 'store/app/types'
import {
  CONNECTOR_STOPPED,
  NODE_SCHEMA_DROPPED,
  SELECTION_DELETED,
  DropNodeSchemaAction,
  GraphConnection,
  GraphHotspot,
  GraphNode,
} from 'store/graph/types'
import { NodeSchema } from 'store/library/types'


const HOTSPOT_DELTA = 6


function findHotspot(x: number, y: number, nodes: Array<GraphNode>): GraphHotspot | undefined {
  for (const node of nodes) {
    for (const hotspot of node.hotspots) {
      const hx = node.x + hotspot.offsetX
      const hy = node.y + hotspot.offsetY
      if (hx - HOTSPOT_DELTA <= x && x <= hx + HOTSPOT_DELTA) {
        if (hy - HOTSPOT_DELTA <= y && y <= hy + HOTSPOT_DELTA) {
          return hotspot
        }
      }
    }
  }
  return undefined
}


function createConnection(
  connector: GraphConnection,
  nodes: Array<GraphNode>,
): GraphConnection | undefined {
  if (connector.source) {
    const { x, y } = connector.targetPos
    const hotspot = findHotspot(x, y, nodes)
    if (hotspot) {
      return {
        source: connector.source,
        target: hotspot.uid,
        sourcePlacement: connector.sourcePlacement,
        sourcePos: { ...connector.sourcePos },
        targetPos: {
          x: 0,
          y: 0,
          offsetX: hotspot.offsetX,
          offsetY: hotspot.offsetY,
        },
        targetPlacement: hotspot.placement,
      }
    }
  } else if (connector.target) {
    const { x, y } = connector.sourcePos
    const hotspot = findHotspot(x, y, nodes)
    if (hotspot) {
      return {
        source: hotspot.uid,
        target: connector.target,
        sourcePlacement: hotspot.placement,
        sourcePos: {
          x: 0,
          y: 0,
          offsetX: hotspot.offsetX,
          offsetY: hotspot.offsetY,
        },
        targetPos: { ...connector.targetPos },
        targetPlacement: connector.targetPlacement,
      }
    }
  }
  return undefined
}


function createNode(schema: NodeSchema, x: number, y: number): [Node, GraphNode] {
  const uid: string = uuid4()

  const hotspots: Array<GraphHotspot> = []
  const count: Record<string, number> = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }

  const slots: Array<string> = schema.slots ? [...schema.slots] : []
  const signals: Array<string> = schema.signals ? [...schema.signals] : []
  const ports: Record<string, Port> = {}

  for (let i = 0; i < slots.length; i += 1) {
    const slot = slots[i]
    const hotspot: GraphHotspot = {
      uid: `${uid}.${slot}`,
      title: _startCase(_camelCase(slot)),
      offsetX: 1,
      offsetY: 20 + (18 * i),
      fill: 'red',
      placement: 'left',
    }
    hotspots.push(hotspot)
    count[hotspot.placement] += 1
  }

  for (let i = 0; i < signals.length; i += 1) {
    const signal = signals[i]
    const hotspot: GraphHotspot = {
      uid: `${uid}.${signal}`,
      title: _startCase(_camelCase(signal)),
      offsetX: 149,
      offsetY: 20 + (18 * i),
      fill: 'red',
      placement: 'right',
    }
    hotspots.push(hotspot)
    count[hotspot.placement] += 1
  }

  const width = 150
  let height = Math.max(50, 25 + (count.left * 18), 25 + (count.right * 18))

  for (const port of schema.ports || []) {
    ports[port.name] = {
      default: port.default ? JSON.parse(port.default) : undefined,
      direction: port.direction,
      label: _startCase(_camelCase(port.name)),
      name: port.name,
      schema: port,
      type: port.type,
      value: undefined,
    }

    const isSource = port.direction === 'output'
    const placement = isSource ? 'right' : 'left'
    const placementOffset = 20 + (18 * count[placement])
    const offset = { offsetX: 0, offsetY: 0 }
    if (placement === 'right') {
      offset.offsetX = width - 1
      offset.offsetY = placementOffset
    } else if (placement === 'left') {
      offset.offsetX = 1
      offset.offsetY = placementOffset
    } else if (placement === 'top') {
      offset.offsetX = placementOffset
      offset.offsetY = 1
    } else if (placement === 'bottom') {
      offset.offsetX = placementOffset
      offset.offsetY = height - 1
    }

    height = Math.max(50, 25 + (count.left * 18), 25 + (count.right * 18))

    const hotspot: GraphHotspot = {
      ...offset,
      uid: `${uid}.${port.name}`,
      title: _startCase(_camelCase(port.name)),
      fill: '#1a1a1a',
      placement,
    }
    hotspots.push(hotspot)
  }

  const label = _startCase(_camelCase(schema.name))

  const node: Node = {
    label,
    ports,
    schema,
    signals,
    slots,
    uid,
    parentId: '',
  }

  const graphNode: GraphNode = {
    uid,
    label,
    x,
    y,
    width,
    height,
    hotspots,
  }

  return [node, graphNode]
}

function* maybeCreateConnectionSaga(): SagaIterator<void> {
  const connector = yield select(getConnector)
  const nodes = yield select(getNodes)
  if (connector) {
    const connection = yield call(createConnection, connector, nodes)
    if (connection) {
      yield put(addConnection(connection))
    }
  }
  yield put(finishConnector())
}

function* createNodeSaga(action: DropNodeSchemaAction): SagaIterator<void> {
  const { nodeSchema, x, y } = action
  const [node, graphNode] = yield call(createNode, nodeSchema, x, y)
  yield put(addBlueprintNode(node))
  yield put(addGraphNode(graphNode))
}

function* clearGraphSaga(): SagaIterator<void> {
  yield put(clearGraph())
}

function* deleteSelectionSaga(): SagaIterator<void> {
  const selection = yield select(getSelection)
  for (const selected of selection) {
    if (selected.includes('--')) {
      const [source, target] = selected.split('--')
      yield put(deleteConnection(source, target))
    } else {
      yield put(deleteBlueprintNode(selected))
      yield put(deleteGraphNode(selected))
    }
  }
  yield put(clearSelection())
}

export function* graphSaga(): SagaIterator<void> {
  yield takeEvery(CONNECTOR_STOPPED, maybeCreateConnectionSaga)
  yield takeEvery(NODE_SCHEMA_DROPPED, createNodeSaga)
  yield takeEvery(FILE_INITIALIZED, clearGraphSaga)
  yield takeEvery(SELECTION_DELETED, deleteSelectionSaga)
}
