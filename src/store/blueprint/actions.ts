import {
  BLUEPRINT_INITIALIZED,
  NODE_ADDED,
  NODE_DELETED,
  NODE_PROPERTY_CHANGED,
  PORT_VALUE_CHANGED,
  BlueprintAction,
  Node,
} from 'store/blueprint/types'

export const addNode = (node: Node): BlueprintAction => ({
  type: NODE_ADDED,
  node,
})

export const initializeBlueprint = (): BlueprintAction => ({
  type: BLUEPRINT_INITIALIZED,
})

export const deleteNode = (uid: string) => ({
  type: NODE_DELETED,
  uid,
})

export const changeNodeProperty = (uid: string, property: string, value: any): BlueprintAction => ({
  type: NODE_PROPERTY_CHANGED,
  uid,
  property,
  value,
})

export const nodePropertyChanger = (property: string) => (
  (uid: string, value: any) => changeNodeProperty(uid, property, value)
)

export const changePortValue = (uid: string, portName: string, value: any): BlueprintAction => ({
  type: PORT_VALUE_CHANGED,
  uid,
  portName,
  value,
})
