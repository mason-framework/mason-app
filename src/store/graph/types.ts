import { Connection, Hotspot, PositionDelta } from 'store/blueprint/types'
import { NodeSchema } from 'store/library/types'

export const CONNECTOR_FINISHED = '@@graph/CONNECTOR_FINISHED'
export const CONNECTOR_MOVED = '@@graph/CONNECTOR_MOVED'
export const CONNECTOR_STARTED = '@@graph/CONNECTOR_STARTED'
export const CONNECTOR_STOPPED = '@@graph/CONNECTOR_STOPPED'

export const NODE_DELTA_CLEARED = '@@graph/NODE_DELTA_CLEARED'
export const NODE_SCHEMA_DROPPED = '@@graph/NODE_SCHEMA_DROPPED'
export const NODE_MOVE_FINISHED = '@@graph/NODE_MOVE_FINISHED'
export const NODE_MOVED = '@@graph/NODE_MOVED'

// Actions
export interface DropNodeSchemaAction {
  type: typeof NODE_SCHEMA_DROPPED
  schema: NodeSchema
  x: number
  y: number
}

interface ClearNodeDeltaAction {
  type: typeof NODE_DELTA_CLEARED
  uid: string
}

interface MoveConnectorAction {
  type: typeof CONNECTOR_MOVED
  dx: number
  dy: number
}

interface MoveConnectorAction {
  type: typeof CONNECTOR_MOVED
  dx: number
  dy: number
}

export interface MoveNodeAction {
  type: typeof NODE_MOVED
  uid: string
  dx: number
  dy: number
}

interface FinishConnectorAction {
  type: typeof CONNECTOR_FINISHED
}

export interface FinishNodeMoveAction {
  type: typeof NODE_MOVE_FINISHED
  uid: string
}

interface StartConnectorAction {
  type: typeof CONNECTOR_STARTED
  hotspot: Hotspot
  x: number
  y: number
}

interface StopConnectorAction {
  type: typeof CONNECTOR_STOPPED
}

export type GraphAction =
  ClearNodeDeltaAction |
  DropNodeSchemaAction |
  FinishConnectorAction |
  FinishNodeMoveAction |
  MoveConnectorAction |
  MoveNodeAction |
  StartConnectorAction |
  StopConnectorAction


// State
export interface GraphState {
  connector?: Connection
  nodeDeltas: Record<string, PositionDelta>
}

export const createGraphState = (options: any = {}): GraphState => ({
  connector: undefined,
  nodeDeltas: {},
  ...options,
})
