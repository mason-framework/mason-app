import { LibraryNode } from 'store/server/types'

export const COLORS_BG = '#1a1a1a'
export const COLORS_DEFAULT_STROKE = '#666'
export const COLORS_DRAG_STROKE = 'yellow'
export const COLORS_NODE_FILL = '#3a3a3a'
export const COLORS_SELECTED_STROKE = '#999'
export const COLORS_TEXT_FILL = '#aaa'

export const CONNECTION_ADDED = '@@graph/CONNECTION_ADDED'
export const CONNECTION_CLEARED = '@@graph/CONNECTION_CLEARED'
export const CONNECTION_STARTED = '@@graph/CONNECTION_STARTED'
export const CONNECTION_STOPPED = '@@graph/CONNECTION_STOPPED'
export const CONNECTION_MOVED = '@@graph/CONNECTION_MOVED'
export const GRAPH_NODE_DROPPED = '@@graph/NODE_DROPPED'
export const GRAPH_NODE_MOVED = '@@graph/NODE_MOVED'
export const GRAPH_NODE_SELECTED = '@@graph/NODE_SELECTED'
export const LIBRARY_NODE_DROPPED = '@@graph/LIBRARY_NODE_DROPPED'

export interface Delta {
  dx: number
  dy: number
}

export interface GraphHotspot {
  uid: string
  offsetX: number
  offsetY: number
  direction?: string
  title?: string
  fill?: string
}

export interface GraphConnection {
  source: string
  sourceOffsetX?: number
  sourceOffsetY?: number
  sourceX?: number
  sourceY?: number
  target: string
  targetOffsetX?: number
  targetOffsetY?: number
  targetX?: number
  targetY?: number
}

export interface GraphNode {
  height: number
  hotspots: Array<GraphHotspot>
  nodeType: string
  title: string
  uid: string
  width: number
  x: number
  y: number
}

export interface ConnectionAddedAction {
  type: typeof CONNECTION_ADDED
  connection: GraphConnection
}

export interface ConnectionClearedAction {
  type: typeof CONNECTION_CLEARED
}

export interface ConnectionStartedAction {
  type: typeof CONNECTION_STARTED
  connection: GraphConnection
}

export interface ConnectionMovedAction {
  type: typeof CONNECTION_MOVED
  dx: number
  dy: number
}

export interface ConnectionStoppedAction {
  type: typeof CONNECTION_STOPPED
}

export interface GraphNodeDroppedAction {
  type: typeof GRAPH_NODE_DROPPED
  nodeType: string
  x: number
  y: number
}

export interface GraphNodeMovedAction {
  type: typeof GRAPH_NODE_MOVED
  uid: string
  dx: number
  dy: number
}

export interface GraphNodeSelectedAction {
  type: typeof GRAPH_NODE_SELECTED
  uid: string
}

export interface LibraryNodeDroppedAction {
  type: typeof LIBRARY_NODE_DROPPED
  nodeType: LibraryNode
  x: number
  y: number
}

export type GraphAction = GraphNodeDroppedAction
                          | GraphNodeMovedAction
                          | GraphNodeSelectedAction
                          | LibraryNodeDroppedAction
                          | ConnectionStartedAction
                          | ConnectionStoppedAction
                          | ConnectionMovedAction
                          | ConnectionAddedAction
                          | ConnectionClearedAction

export interface GraphState {
  deltas: Record<string, Delta>
  connection?: GraphConnection,
  nodeConnections: Array<GraphConnection>
  nodes: Array<GraphNode>
  selectedNodeId: string
}
