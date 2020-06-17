import {
  BLUEPRINT_ADDED,
  BLUEPRINT_LOADED,
  CONNECTION_ADDED,
  CONNECTION_DELETED,
  INITIALIZED,
  NODE_ADDED,
  NODE_CHANGED,
  NODE_DELETED,
  PORT_CHANGED,
  BlueprintAction,
  Blueprint,
  Connection,
  Node,
  BlueprintState,
} from 'store/blueprint/types'


export const addConnection = (connection: Connection): BlueprintAction => ({
  type: CONNECTION_ADDED,
  connection,
})


export const addBlueprint = (blueprint: Blueprint, current: boolean = false) => ({
  type: BLUEPRINT_ADDED,
  blueprint,
  current,
})


export const addNode = (node: Node): BlueprintAction => ({
  type: NODE_ADDED,
  node,
})

export const changeNode = (uid: string, properties: Record<string, any>): BlueprintAction => ({
  type: NODE_CHANGED,
  uid,
  properties,
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

export const loadBlueprint = (state: BlueprintState): BlueprintAction => ({
  type: BLUEPRINT_LOADED,
  state,
})

export const initialize = (): BlueprintAction => ({
  type: INITIALIZED,
})
