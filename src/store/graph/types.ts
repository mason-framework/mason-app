import { NodeSchema } from 'store/library/types'

export const COLORS_BG = '#1a1a1a'
export const COLORS_DEFAULT_STROKE = '#666'
export const COLORS_DRAG_STROKE = 'yellow'
export const COLORS_NODE_FILL = '#3a3a3a'
export const COLORS_SELECTED_STROKE = 'aqua'
export const COLORS_TEXT_FILL = '#aaa'

export const CONNECTOR_FINISHED = '@@graph/CONNECTOR_FINISHED'
export const CONNECTOR_MOVED = '@@graph/CONNECTOR_MOVED'
export const CONNECTOR_STARTED = '@@graph/CONNECTOR_STARTED'
export const CONNECTOR_STOPPED = '@@graph/CONNECTOR_STOPPED'
export const CONNECTION_ADDED = '@@graph/CONNECTION_ADDED'
export const CONNECTION_DELETED = '@@graph/CONNECTION_DELETED'

export const GRAPH_CLEARED = '@@graph/CLEARED'

export const NODE_ADDED = '@@graph/NODE_ADDED'
export const NODE_DELETED = '@@graph/NODE_DELETED'
export const NODE_SCHEMA_DROPPED = '@@graph/NODE_SCHEMA_DROPPED'
export const NODE_MOVED = '@@graph/NODE_MOVED'
export const NODE_MOVE_FINISHED = '@@graph/NODE_MOVE_FINISHED'

export const SELECTION_ADDED = '@@graph/SELECTION_ADDED'
export const SELECTION_DELETED = '@@graph/SELECTION_DELETED'
export const SELECTION_CLEARED = '@@graph/SELECTION_CLEARED'

export interface GraphDelta {
  dx: number
  dy: number
}

export interface GraphPosition {
  x: number
  y: number
  offsetX: number
  offsetY: number
}

export interface GraphConnection {
  source: string
  target: string
  sourcePos: GraphPosition
  targetPos: GraphPosition
  sourcePlacement: string
  targetPlacement: string
}

export interface GraphHotspot {
  uid: string
  offsetX: number
  offsetY: number
  title: string
  fill: string
  placement: string
}

export interface GraphNode {
  uid: string
  x: number
  y: number
  width: number
  height: number
  label: string
  hotspots: Array<GraphHotspot>
}

interface AddConnectionAction {
  type: typeof CONNECTION_ADDED
  connection: GraphConnection
}

interface AddNodeAction {
  type: typeof NODE_ADDED
  node: GraphNode
}

interface ClearGraphAction {
  type: typeof GRAPH_CLEARED
}

interface DeleteConnectionAction {
  type: typeof CONNECTION_DELETED
  source: string
  target: string
}

interface DeleteNodeAction {
  type: typeof NODE_DELETED
  uid: string
}

export interface DropNodeSchemaAction {
  type: typeof NODE_SCHEMA_DROPPED
  nodeSchema: NodeSchema
  x: number
  y: number
}

interface FinishConnectorAction {
  type: typeof CONNECTOR_FINISHED
}

interface FinishNodeMoveAction {
  type: typeof NODE_MOVE_FINISHED
  uid: string
}

interface MoveConnectorAction {
  type: typeof CONNECTOR_MOVED
  dx: number
  dy: number
}

interface MoveNodeAction {
  type: typeof NODE_MOVED
  uid: string
  dx: number
  dy: number
}

interface AddSelectionAction {
  type: typeof SELECTION_ADDED
  uid: string
}

interface ClearSelectionAction {
  type: typeof SELECTION_CLEARED
}

interface DeleteSelectionAction {
  type: typeof SELECTION_DELETED
}

interface StartConnectorAction {
  type: typeof CONNECTOR_STARTED
  connector: GraphConnection
}

interface StopConnectorAction {
  type: typeof CONNECTOR_STOPPED
}

export type GraphAction =
  AddConnectionAction |
  AddNodeAction |
  ClearGraphAction |
  ClearSelectionAction |
  DeleteNodeAction |
  DeleteConnectionAction |
  DeleteSelectionAction |
  DropNodeSchemaAction |
  FinishConnectorAction |
  FinishNodeMoveAction |
  MoveConnectorAction |
  MoveNodeAction |
  AddSelectionAction |
  StartConnectorAction |
  StopConnectorAction


export interface GraphState {
  connector?: GraphConnection,
  deltas: Record<string, GraphDelta>
  nodes: Array<GraphNode>
  connections: Array<GraphConnection>
  selection: Array<string>
}
