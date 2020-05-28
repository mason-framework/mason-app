import { NodeSchema, PortSchema } from 'store/library/types'

export const BLUEPRINT_INITIALIZED = '@@blueprint/BLUEPRINT_INITIALIZED'

export const NODE_ADDED = '@@blueprint/NODE_ADDED'
export const NODE_DELETED = '@@blueprint/NODE_DELETED'
export const NODE_PROPERTY_CHANGED = '@@blueprint/NODE_PROPERTY_CHANGED'
export const PORT_VALUE_CHANGED = '@@blueprint/PORT_VALUE_CHANGED'


export interface Port {
  default: any
  direction: string
  label: string
  name: string
  schema: PortSchema
  type: string
  value: any
}

export interface Node {
  label: string
  ports: Record<string, Port>
  schema: NodeSchema
  signals: Array<string>
  slots: Array<string>
  uid: string
  parentId: string
}

export interface Blueprint {
  label: string
  type: string
  uid: string
}

export interface Delta {
  dx: number
  dy: number
}

export interface InitializeBlueprintAction {
  type: typeof BLUEPRINT_INITIALIZED
}

interface AddNodeAction {
  type: typeof NODE_ADDED
  node: Node
}

interface DeleteNodeAction {
  type: typeof NODE_DELETED
  uid: string
}

interface ChangePortValueAction {
  type: typeof PORT_VALUE_CHANGED
  uid: string
  portName: string
  value: any
}

interface ChangeNodePropertyAction {
  type: typeof NODE_PROPERTY_CHANGED
  uid: string
  property: string
  value: any
}

export type BlueprintAction =
  AddNodeAction |
  InitializeBlueprintAction |
  ChangePortValueAction |
  ChangeNodePropertyAction |
  DeleteNodeAction


export interface BlueprintState {
  blueprints: Record<string, Blueprint>
  currentBlueprintId: string
  nodes: Record<string, Node>
}
