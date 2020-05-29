import {
  CONNECTION_ADDED,
  CONNECTION_DELETED,
  INITIALIZED,
  NODE_ADDED,
  NODE_CHANGED,
  NODE_DELETED,
  PORT_CHANGED,
  SELECTION_ADDED,
  SELECTION_CLEARED,
  SELECTION_DELETED,
  BlueprintAction,
  Connection,
  Node,
} from 'store/blueprint/types'


export const addConnection = (connection: Connection): BlueprintAction => ({
  type: CONNECTION_ADDED,
  connection,
})


export const addNode = (node: Node): BlueprintAction => ({
  type: NODE_ADDED,
  node,
})


export const addSelection = (uid: string): BlueprintAction => ({
  type: SELECTION_ADDED,
  uid,
})


export const changeNode = (uid: string, properties: Record<string, any>): BlueprintAction => ({
  type: NODE_CHANGED,
  uid,
  properties,
})


export const clearSelection = (): BlueprintAction => ({
  type: SELECTION_CLEARED,
})


export const changePort = (
  uid: string,
  name: string,
  properties: Record<string, any>,
): BlueprintAction => ({
  type: PORT_CHANGED,
  uid,
  name,
  properties,
})


export const deleteConnection = (
  sourceNodeId: string,
  sourceName: string,
  targetNodeId: string,
  targetName: string,
): BlueprintAction => ({
  type: CONNECTION_DELETED,
  sourceNodeId,
  sourceName,
  targetNodeId,
  targetName,
})


export const deleteNode = (uid: string): BlueprintAction => ({
  type: NODE_DELETED,
  uid,
})


export const deleteSelection = (): BlueprintAction => ({
  type: SELECTION_DELETED,
})

export const initialize = (): BlueprintAction => ({
  type: INITIALIZED,
})
