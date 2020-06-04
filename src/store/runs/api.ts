import _reduce from 'lodash/reduce'
import _values from 'lodash/values'
import { getClient } from 'store/app/api'

import {
  Blueprint as ServerBlueprint,
  Connection as ServerConnection,
  Node as ServerNode,
  Port as ServerPort,
} from 'store/blueprint/proto/blueprint'
import {
  BlueprintState,
  Blueprint,
  Connection,
  Node,
  Port,
} from 'store/blueprint/types'
import { finishRun } from 'store/runs/actions'
import {
  STATUS_OK,
  STATUS_ERROR,
  ExecutionResult,
  RunAction,
} from 'store/runs/types'


function getRoot({ blueprints }: BlueprintState): Blueprint | undefined {
  for (const blueprint of _values(blueprints)) {
    if (!blueprint.parentId) {
      return blueprint
    }
  }
  return undefined
}

const createConnections = (
  blueprintId: string,
  { connections }: BlueprintState,
): Array<ServerConnection> => _reduce(
  connections, (acc: Array<ServerConnection>, conn: Connection): Array<ServerConnection> => {
    if (conn.blueprintId === blueprintId) {
      acc.push({
        source: `${conn.sourceNodeId}.${conn.sourceName}`,
        target: `${conn.targetNodeId}.${conn.targetName}`,
      })
    }
    return acc
  }, [],
)

const createPorts = (node: Node): Array<ServerPort> => _reduce(
  node.ports, (acc: Array<ServerPort>, port: Port) => {
    acc.push({
      name: port.name,
      value: JSON.stringify(port.value),
      label: port.label,
      type: port.type,
      direction: port.direction,
    })
    return acc
  }, [],
)

const createNode = (
  blueprintId: string,
  node: Node,
  state: BlueprintState,
): ServerNode => {
  const ports = createPorts(node)
  const nodes = createNodes(blueprintId, node.uid, state)
  return {
    uid: node.uid,
    label: node.label,
    type: `${node.schema.group}.${node.schema.name}`,
    ports,
    nodes,
    signals: node.signals,
    slots: node.slots,
  }
}

const createNodes = (
  blueprintId: string,
  parentId: string,
  state: BlueprintState,
): Array<ServerNode> => _reduce(
  state.nodes, (acc: Array<ServerNode>, node: Node): Array<ServerNode> => {
    if (node.blueprintId === blueprintId && node.parentId === parentId) {
      acc.push(createNode(blueprintId, node, state))
    }
    return acc
  }, [],
)


export function createBlueprint(state: BlueprintState): ServerBlueprint | undefined {
  const root = getRoot(state)
  if (!root) { return undefined }

  const connections = createConnections(root.uid, state)
  const nodes = createNodes(root.uid, '', state)

  return {
    uid: root.uid,
    label: root.label,
    type: root.type,
    connections,
    nodes,
  }
}


export async function runBlueprint(
  blueprint: ServerBlueprint,
  uid: string,
  inputs: Record<string, any> | undefined,
  level: string,
): Promise<RunAction | undefined> {
  const data = {
    blueprint: ServerBlueprint.toJSON(blueprint),
    inputs,
    level,
  }
  const client = getClient()
  const response = client.post(
    '/execute',
    data,
    {
      headers: {
        'X-Request-ID': uid,
      },
    },
  )
  try {
    const { data: responseData } = await response
    const result: ExecutionResult = {
      output: responseData,
      error: undefined,
    }
    return finishRun(uid, STATUS_OK, result)
  } catch (error) {
    const result: ExecutionResult = {
      output: undefined,
      error,
    }
    return finishRun(uid, STATUS_ERROR, result)
  }
}
