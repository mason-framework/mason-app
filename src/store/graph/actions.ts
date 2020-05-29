import { Hotspot } from 'store/blueprint/types'
import { NodeSchema } from 'store/library/types'
import {
  CONNECTOR_FINISHED,
  CONNECTOR_MOVED,
  CONNECTOR_STARTED,
  CONNECTOR_STOPPED,
  NODE_DELTA_CLEARED,
  NODE_MOVE_FINISHED,
  NODE_SCHEMA_DROPPED,
  NODE_MOVED,
  GraphAction,
} from 'store/graph/types'


export const clearNodeDelta = (uid: string): GraphAction => ({
  type: NODE_DELTA_CLEARED,
  uid,
})

export const finishConnector = (): GraphAction => ({
  type: CONNECTOR_FINISHED,
})

export const moveConnector = (dx: number, dy: number): GraphAction => ({
  type: CONNECTOR_MOVED,
  dx,
  dy,
})

export const moveNode = (uid: string, dx: number, dy: number): GraphAction => ({
  type: NODE_MOVED,
  uid,
  dx,
  dy,
})

export const startConnector = (hotspot: Hotspot, x: number, y: number): GraphAction => ({
  type: CONNECTOR_STARTED,
  hotspot,
  x,
  y,
})

export const stopConnector = (): GraphAction => ({
  type: CONNECTOR_STOPPED,
})

export const dropNodeSchema = (schema: NodeSchema, x: number, y: number): GraphAction => ({
  type: NODE_SCHEMA_DROPPED,
  schema,
  x,
  y,
})

export const finishMoveNode = (uid: string): GraphAction => ({
  type: NODE_MOVE_FINISHED,
  uid,
})
