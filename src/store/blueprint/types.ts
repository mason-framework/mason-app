import _startCase from 'lodash/startCase'
import _camelCase from 'lodash/camelCase'

import { v4 as uuid4 } from 'uuid'
import { NodeSchema, PortSchema } from 'store/library/types'

const MIN_HEIGHT: number = 40

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

const COLOR_FLOW = '#e0e0e0'
const COLOR_PORT_TYPES: Record<string, string> = {
  int: 'yellow',
  float: 'yellow',
}
const COLOR_DEFAULT_PORT_TYPE = '#afa0e0'


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
  color: string
  offsetX: number
  offsetY: number
  placement: string
  title: string
  connectionType: string
  textVisible: boolean
}

export interface Connection {
  sourceNodeId: string
  sourceName: string
  sourceColor: string
  sourcePlacement: string
  sourcePos: Position
  targetNodeId: string
  targetName: string
  targetPlacement: string
  targetPos: Position
  targetColor: string
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
  sourceColor: 'white',
  sourcePos: {
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
  },
  targetNodeId: '',
  targetName: '',
  targetPlacement: 'left',
  targetColor: 'white',
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
  const total: Record<string, number> = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  }
  const count: Record<string, number> = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  }
  const pad: Record<string, number> = {
    top: 0,
    topLeft: 0,
    topRight: 0,
    left: 15,
    bottom: 0,
    right: 15,
  }

  const slots: Array<string> = schema.slots ? [...schema.slots] : []
  const signals: Array<string> = schema.signals ? [...schema.signals] : []
  const ports: Record<string, Port> = {}
  const spacing = 20

  total.left = slots.length
  total.right = signals.length
  if (schema.ports) {
    for (const portSchema of schema.ports) {
      if (portSchema.visibility === 'visible' || portSchema.visibility === 'connectable') {
        const placement = portSchema.direction === 'input' ? 'left' : 'right'
        total[placement] += 1
      }
    }
  }

  let width
  switch (schema.shape) {
    case 'round': {
      width = 120
      pad.top = 10
      pad.bottom = 10
      pad.left = 20
      pad.right = 20
      break
    }
    default: {
      width = 150
      pad.top = 40
      break
    }
  }

  const leftHeight = pad.top + (total.left * spacing) + pad.bottom
  const rightHeight = pad.top + (total.right * spacing) + pad.bottom
  const height = Math.max(MIN_HEIGHT, leftHeight, rightHeight)

  if (schema.shape === 'round') {
    pad.topLeft = ((height - leftHeight) / 2) + (spacing / 2)
    pad.topRight = ((height - rightHeight) / 2) + (spacing / 2)
  }

  for (let i = 0; i < slots.length; i += 1) {
    const slot = slots[i]
    const hotspot: Hotspot = {
      nodeId: uid,
      name: slot,
      title: titlize(slot),
      offsetX: pad.left,
      offsetY: pad.top + pad.topLeft + (spacing * i),
      color: COLOR_FLOW,
      placement: 'left',
      connectionType: 'slot',
      textVisible: slots.length > 1,
    }
    hotspots.push(hotspot)
    count.left += 1
  }

  for (let i = 0; i < signals.length; i += 1) {
    const signal = signals[i]
    const hotspot: Hotspot = {
      nodeId: uid,
      name: signal,
      title: titlize(signal),
      offsetX: width - pad.right,
      offsetY: pad.top + pad.topRight + (spacing * i),
      color: COLOR_FLOW,
      placement: 'right',
      connectionType: 'signal',
      textVisible: signals.length > 1,
    }
    hotspots.push(hotspot)
    count.right += 1
  }

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
      visibility: portSchema.visibility,
    }

    ports[port.name] = port

    if (portSchema.visibility === 'visible' || portSchema.visibility === 'connectable') {
      const placementOffset = (spacing * count[port.placement])
      const offset = { offsetX: 0, offsetY: 0 }
      if (port.placement === 'right') {
        offset.offsetX = width - pad.right
        offset.offsetY = pad.top + pad.topRight + placementOffset
      } else if (port.placement === 'left') {
        offset.offsetX = pad.left
        offset.offsetY = pad.top + pad.topLeft + placementOffset
      }

      const hotspot: Hotspot = {
        ...offset,
        nodeId: uid,
        name: port.name,
        title: titlize(port.name),
        color: COLOR_PORT_TYPES[portSchema.type] || COLOR_DEFAULT_PORT_TYPE,
        placement: port.placement,
        connectionType: 'data',
        textVisible: total[port.placement] > 1,
      }
      hotspots.push(hotspot)
      count[port.placement] += 1
    }
  }

  const label = schema.defaultLabel || titlize(schema.name)
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
