import _startCase from 'lodash/startCase'
import _camelCase from 'lodash/camelCase'

import { v4 as uuid4 } from 'uuid'
import { NodeSchema, PortSchema } from 'store/library/types'

// Action Types
export const BLUEPRINT_ADDED = '@@blueprint/BLUEPRINT_ADDED'
export const BLUEPRINT_LOADED = '@@blueprint/BLUEPRINT_LOADED'

export const CONNECTION_ADDED = '@@blueprint/CONNECTION_ADDED'
export const CONNECTION_DELETED = '@@blueprint/CONNECTION_DELETED'

export const INITIALIZED = '@@blueprint/INITIALIZED'

export const NODE_ADDED = '@@blueprint/NODE_ADDED'
export const NODE_DELETED = '@@blueprint/NODE_DELETED'
export const NODE_CHANGED = '@@blueprint/NODE_CHANGED'

export const PORT_CHANGED = '@@blueprint/PORT_CHANGED'


// Interfaces
export interface PositionDelta {
  dx: number
  dy: number
}

export interface Position {
  x: number
  y: number
  offsetX: number
  offsetY: number
}

export interface Hotspot {
  nodeId: string
  name: string
  fill: string
  offsetX: number
  offsetY: number
  placement: string
  title: string
  connectionType: string
}

export interface Connection {
  sourceNodeId: string
  sourceName: string
  sourcePlacement: string
  sourcePos: Position
  targetNodeId: string
  targetName: string
  targetPlacement: string
  targetPos: Position
  type: string
}


export interface TreeItem {
  key: string
  title: string | React.ReactNode
  children: Array<TreeItem>
}


export const createConnection = (options: any = {}): Connection => ({
  sourceNodeId: '',
  sourceName: '',
  sourcePlacement: 'right',
  sourcePos: {
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
  },
  targetNodeId: '',
  targetName: '',
  targetPlacement: 'left',
  targetPos: {
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
  },
  type: 'data',
  ...options,
})

export interface Port {
  default: any
  direction: string
  label: string
  name: string
  placement: string
  schema: PortSchema
  type: string
  value: any
  visibility: string
}

export interface Node {
  height: number
  hotspots: Array<Hotspot>
  label: string
  nodes: Array<Node>
  parentId: string
  ports: Record<string, Port>
  schema: NodeSchema
  signals: Array<string>
  slots: Array<string>
  uid: string
  width: number
  x: number
  y: number
}

const titlize = (text: string): string => _startCase(_camelCase(text))

export const createNode = (schema: NodeSchema, options: any = {}): Node => {
  const uid = options.uid || uuid4()
  const hotspots: Array<Hotspot> = []
  const count: Record<string, number> = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  }

  const slots: Array<string> = schema.slots ? [...schema.slots] : []
  const signals: Array<string> = schema.signals ? [...schema.signals] : []
  const ports: Record<string, Port> = {}
  const width = 150

  for (let i = 0; i < slots.length; i += 1) {
    const slot = slots[i]
    const hotspot: Hotspot = {
      nodeId: uid,
      name: slot,
      title: titlize(slot),
      offsetX: 1,
      offsetY: 20 + (18 * i),
      fill: 'red',
      placement: 'left',
      connectionType: 'slot',
    }
    hotspots.push(hotspot)
    count[hotspot.placement] += 1
  }

  for (let i = 0; i < signals.length; i += 1) {
    const signal = signals[i]
    const hotspot: Hotspot = {
      nodeId: uid,
      name: signal,
      title: titlize(signal),
      offsetX: 149,
      offsetY: 20 + (18 * i),
      fill: 'red',
      placement: 'right',
      connectionType: 'signal',
    }
    hotspots.push(hotspot)
    count[hotspot.placement] += 1
  }

  let height = Math.max(50, 25 + (count.left * 18), 25 + (count.right * 18))

  for (const portSchema of schema.ports || []) {
    const port: Port = {
      default: portSchema.default ? JSON.parse(portSchema.default) : undefined,
      direction: portSchema.direction,
      label: titlize(portSchema.name),
      name: portSchema.name,
      placement: portSchema.direction === 'input' ? 'left' : 'right',
      schema: portSchema,
      type: portSchema.type,
      value: undefined,
      visibility: 'visible',
    }

    ports[port.name] = port

    const placementOffset = 20 + (18 * count[port.placement])
    const offset = { offsetX: 0, offsetY: 0 }
    if (port.placement === 'right') {
      offset.offsetX = width - 1
      offset.offsetY = placementOffset
    } else if (port.placement === 'left') {
      offset.offsetX = 1
      offset.offsetY = placementOffset
    } else if (port.placement === 'top') {
      offset.offsetX = placementOffset
      offset.offsetY = 1
    } else if (port.placement === 'bottom') {
      offset.offsetX = placementOffset
      offset.offsetY = height - 1
    }

    height = Math.max(50, 25 + (count.left * 18), 25 + (count.right * 18))

    const hotspot: Hotspot = {
      ...offset,
      nodeId: uid,
      name: port.name,
      title: titlize(port.name),
      fill: '#1a1a1a',
      placement: port.placement,
      connectionType: 'data',
    }
    hotspots.push(hotspot)
    count[hotspot.placement] += 1
  }

  const label = titlize(schema.name)
  return {
    label,
    ports,
    schema,
    signals,
    slots,
    uid,
    parentId: '',
    width,
    height,
    x: 0,
    y: 0,
    hotspots,
    ...options,
  }
}

export interface Blueprint {
  label: string
  parentId: string
  type: string
  uid: string
}

export const createBlueprint = (options: any = {}): Blueprint => ({
  uid: uuid4(),
  type: 'node.Blueprint',
  label: 'Untitled',
  parentId: '',
  ...options,
})

// Actions
interface AddBlueprintAction {
  type: typeof BLUEPRINT_ADDED
  blueprint: Blueprint
  current: boolean
}

interface AddConnectionAction {
  type: typeof CONNECTION_ADDED
  connection: Connection
}

interface AddNodeAction {
  type: typeof NODE_ADDED
  node: Node
}

interface ChangeNodeAction {
  type: typeof NODE_CHANGED
  uid: string
  properties: Record<string, any>
}

interface ChangePortAction {
  type: typeof PORT_CHANGED
  uid: string
  name: string
  properties: Record<string, any>
}

interface DeleteConnectionAction {
  type: typeof CONNECTION_DELETED
  sourceNodeId: string
  sourceName: string
  targetNodeId: string
  targetName: string
}

interface DeleteNodeAction {
  type: typeof NODE_DELETED
  uid: string
}

// State
export interface BlueprintState {
  connections: Array<Connection>
  nodes: Record<string, Node>
}

export const createBlueprintState = (options: any = {}): BlueprintState => ({
  connections: [],
  nodes: {},
  ...options,
})

interface LoadBlueprintAction {
  type: typeof BLUEPRINT_LOADED
  state: BlueprintState
}

interface InitializeAction {
  type: typeof INITIALIZED
}

export type BlueprintAction =
  AddBlueprintAction |
  AddConnectionAction |
  AddNodeAction |
  ChangeNodeAction |
  ChangePortAction |
  DeleteConnectionAction |
  DeleteNodeAction |
  LoadBlueprintAction |
  InitializeAction
