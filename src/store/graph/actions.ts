import {
  CONNECTION_ADDED,
  CONNECTION_CLEARED,
  CONNECTION_STARTED,
  CONNECTION_STOPPED,
  CONNECTION_MOVED,
  GRAPH_NODE_DROPPED,
  GRAPH_NODE_MOVED,
  GRAPH_NODE_SELECTED,
  LIBRARY_NODE_DROPPED,
  GraphConnection,
  GraphAction,
} from 'store/graph/types'
import { LibraryNode } from 'store/server/types'

export const addConnection = (connection: GraphConnection): GraphAction => ({
  type: CONNECTION_ADDED,
  connection,
})

export const clearConnection = (): GraphAction => ({
  type: CONNECTION_CLEARED,
})

export const startConnection = (connection: GraphConnection): GraphAction => ({
  type: CONNECTION_STARTED,
  connection,
})

export const stopConnection = (): GraphAction => ({
  type: CONNECTION_STOPPED,
})

export const moveConnection = (dx: number, dy: number): GraphAction => ({
  type: CONNECTION_MOVED,
  dx,
  dy,
})

export const dropGraphNode = (nodeType: string, x: number, y: number): GraphAction => ({
  type: GRAPH_NODE_DROPPED,
  nodeType,
  x,
  y,
})

export const moveGraphNode = (uid: string, dx: number, dy: number): GraphAction => ({
  type: GRAPH_NODE_MOVED,
  uid,
  dx,
  dy,
})

export const selectGraphNode = (uid: string): GraphAction => ({
  type: GRAPH_NODE_SELECTED,
  uid,
})

export const dropLibraryNode = (nodeType: LibraryNode, x: number, y: number): GraphAction => ({
  type: LIBRARY_NODE_DROPPED,
  nodeType,
  x,
  y,
})
