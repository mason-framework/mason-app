import {
  CONNECTION_ADDED,
  CONNECTION_DELETED,
  CONNECTOR_FINISHED,
  CONNECTOR_MOVED,
  CONNECTOR_STARTED,
  CONNECTOR_STOPPED,
  GRAPH_CLEARED,
  NODE_ADDED,
  NODE_DELETED,
  NODE_MOVE_FINISHED,
  NODE_MOVED,
  NODE_SCHEMA_DROPPED,
  SELECTION_CLEARED,
  SELECTION_DELETED,
  SELECTION_ADDED,
  GraphAction,
  GraphConnection,
  GraphNode,
} from 'store/graph/types'
import { NodeSchema } from 'store/library/types'

export const addConnection = (connection: GraphConnection): GraphAction => ({
  type: CONNECTION_ADDED,
  connection,
})

export const addNode = (node: GraphNode): GraphAction => ({
  type: NODE_ADDED,
  node,
})

export const clearGraph = (): GraphAction => ({
  type: GRAPH_CLEARED,
})

export const clearSelection = (): GraphAction => ({
  type: SELECTION_CLEARED,
})

export const deleteConnection = (source: string, target: string): GraphAction => ({
  type: CONNECTION_DELETED,
  source,
  target,
})

export const deleteNode = (uid: string): GraphAction => ({
  type: NODE_DELETED,
  uid,
})

export const deleteSelection = (): GraphAction => ({
  type: SELECTION_DELETED,
})

export const finishConnector = (): GraphAction => ({
  type: CONNECTOR_FINISHED,
})

export const moveConnector = (dx: number, dy: number): GraphAction => ({
  type: CONNECTOR_MOVED,
  dx,
  dy,
})

export const startConnector = (connector: GraphConnection): GraphAction => ({
  type: CONNECTOR_STARTED,
  connector,
})

export const stopConnector = (): GraphAction => ({
  type: CONNECTOR_STOPPED,
})

export const finishMoveNode = (uid: string): GraphAction => ({
  type: NODE_MOVE_FINISHED,
  uid,
})

export const moveNode = (uid: string, dx: number, dy: number): GraphAction => ({
  type: NODE_MOVED,
  uid,
  dx,
  dy,
})

export const addSelection = (uid: string): GraphAction => ({
  type: SELECTION_ADDED,
  uid,
})

export const dropNodeSchema = (nodeSchema: NodeSchema, x: number, y: number): GraphAction => ({
  type: NODE_SCHEMA_DROPPED,
  nodeSchema,
  x,
  y,
})
