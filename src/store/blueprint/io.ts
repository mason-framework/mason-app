import _forEach from 'lodash/forEach'
import _reduce from 'lodash/reduce'
import _keys from 'lodash/keys'
import _size from 'lodash/size'

import {
  Connection,
  Node,
  Port,
  BlueprintState,
  Position,
  createNode,
} from 'store/blueprint/types'
import { NodeSchema } from 'store/library/types'

export interface NodeGeometry {
  x: number
  y: number
  width: number
  height: number
}

export interface ConnectionGeometry {
  sourcePlacement: string
  sourcePos: Position
  sourceColor: string
  targetPlacement: string
  targetPos: Position
  targetColor: string
  type: string
}

export interface Geometry {
  nodes: Record<string, NodeGeometry>
  connections: Record<string, ConnectionGeometry>
}

export interface ServerNode {
  [type: string]: {
    label?: string
    set?: Record<string, string>
    connect?: Record<string, Array<string>>
  }
}

export type ServerBlueprint = Record<string, ServerNode>


function createServerNode(
  node: Node,
  connections: Record<string, Array<string>>,
): ServerNode {
  const set = _reduce(
    node.ports, (
      acc: Record<string, string>,
      port: Port,
    ): Record<string, string> => {
      if (port.value !== undefined) {
        acc[port.name] = JSON.stringify(port.value)
      }
      return acc
    },
    {},
  )

  const connectPorts = _reduce(
    node.ports, (
      acc: Record<string, Array<string>>,
      port: Port,
    ): Record<string, Array<string>> => {
      const sourceId = `${node.uid}.${port.name}`
      if (connections[sourceId]) {
        acc[port.name] = connections[sourceId]
      }
      return acc
    },
    {},
  )

  const connectSignals = _reduce(
    node.signals, (
      acc: Record<string, Array<string>>,
      signal: string,
    ): Record<string, Array<string>> => {
      const sourceId = `${node.uid}.${signal}`
      if (connections[sourceId]) {
        acc[signal] = connections[sourceId]
      }
      return acc
    },
    {},
  )

  const connect = { ...connectPorts, ...connectSignals }
  return {
    [`${node.schema.group}.${node.schema.name}`]: {
      label: node.label ? node.label : undefined,
      set: _size(set) ? set : undefined,
      connect: _size(connect) ? connect : undefined,
    },
  }
}

const mapConnections = (connections: Array<Connection>): Record<string, Array<string>> => (
  _reduce(
    connections,
    (
      acc: Record<string, Array<string>>,
      connection: Connection,
    ): Record<string, Array<string>> => {
      const sourceId = `${connection.sourceNodeId}.${connection.sourceName}`
      const targetId = `${connection.targetNodeId}.${connection.targetName}`
      const key = connection.type === 'data' ? targetId : sourceId
      const value = connection.type === 'data' ? sourceId : targetId
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(value)
      return acc
    },
    {},
  )
)

export function createServerBlueprint(
  nodes: Record<string, Node>,
  connections: Array<Connection>,
): ServerBlueprint {
  const connectionMap = mapConnections(connections)
  const serverNodes = _reduce(
    nodes,
    (
      acc: Record<string, ServerNode>,
      node: Node,
    ): Record<string, ServerNode> => {
      acc[node.uid] = createServerNode(node, connectionMap)
      return acc
    },
    {},
  )
  return serverNodes
}

export function createUi(
  nodes: Record<string, Node>,
  connections: Array<Connection>,
): Geometry {
  const nodeGeom = _reduce(
    nodes,
    (
      acc: Record<string, NodeGeometry>,
      node: Node,
    ): Record<string, NodeGeometry> => {
      acc[node.uid] = {
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
      }
      return acc
    },
    {},
  )
  const connGeom = _reduce(
    connections,
    (
      acc: Record<string, ConnectionGeometry>,
      conn: Connection,
    ): Record<string, ConnectionGeometry> => {
      const {
        sourcePos,
        sourcePlacement,
        sourceColor,
        targetPos,
        targetPlacement,
        targetColor,
        type,
      } = conn
      const uid = `${conn.sourceNodeId}.${conn.sourceName}--${conn.targetNodeId}.${conn.targetName}`
      acc[uid] = {
        sourcePos,
        sourceColor,
        sourcePlacement,
        targetPos,
        targetPlacement,
        targetColor,
        type,
      }
      return acc
    },
    {},
  )
  return { nodes: nodeGeom, connections: connGeom }
}


function loadServerNode(
  uid: string,
  serverNode: ServerNode,
  ui: Geometry,
  schemas: Record<string, NodeSchema>,
): Node {
  const props = {
    ...ui.nodes[uid],
    uid,
  }
  const type = _keys(serverNode)[0]
  const info = serverNode[type]
  const { set } = info
  const schema = schemas[type]
  const node = createNode(schema, props)
  if (set) {
    /* eslint-disable no-param-reassign */
    _forEach(node.ports, (port: Port) => {
      if (set[port.name] !== undefined) {
        port.value = JSON.parse(set[port.name])
      }
    })
    /* eslint-enable no-param-reassign */
  }
  return node
}


export function loadServerBlueprint(
  schemas: Record<string, NodeSchema>,
  blueprint: ServerBlueprint,
  ui: Geometry,
): BlueprintState {
  const connections: Array<Connection> = []
  const nodes = _reduce(
    blueprint,
    (
      acc: Record<string, Node>,
      node: ServerNode,
      uid: string,
    ): Record<string, Node> => {
      acc[uid] = loadServerNode(uid, node, ui, schemas)
      const { connect } = node[_keys(node)[0]]
      _forEach(connect, (targets, sourceName) => {
        const sourceNodeId = uid
        const source = `${uid}.${sourceName}`
        for (const target of targets) {
          const [targetNodeId, targetName] = target.split('.')
          const geom = ui.connections[`${source}--${target}`] || ui.connections[`${target}--${source}`]
          connections.push({
            ...geom,
            sourceNodeId,
            sourceName,
            targetNodeId,
            targetName,
          })
        }
      })
      return acc
    },
    {},
  )
  return { nodes, connections }
}
