import {
  CONNECTION_ADDED,
  CONNECTION_DELETED,
  INITIALIZED,
  NODE_ADDED,
  NODE_CHANGED,
  NODE_DELETED,
  PORT_CHANGED,
  BlueprintAction,
  BlueprintState,
  Node,
  createBlueprint,
  createBlueprintState,
} from 'store/blueprint/types'

const initialState: BlueprintState = createBlueprintState()


function changePort(node: Node, name: string, properties: Record<string, any>): Node {
  const port = node.ports[name]
  if (port) {
    return {
      ...node,
      ports: {
        ...node.ports,
        [name]: {
          ...port,
          ...properties,
        },
      },
    }
  }
  return node
}


export function blueprintReducer(
  state = initialState,
  action: BlueprintAction,
): BlueprintState {
  switch (action.type) {
    case CONNECTION_ADDED: {
      const { connection } = action
      return { ...state, connections: [...state.connections, connection] }
    }
    case CONNECTION_DELETED: {
      const {
        sourceNodeId,
        sourceName,
        targetNodeId,
        targetName,
      } = action
      return {
        ...state,
        connections: state.connections.filter(
          (conn) => !(
            conn.sourceNodeId === sourceNodeId
            && conn.sourceName === sourceName
            && conn.targetNodeId === targetNodeId
            && conn.targetName === targetName
          ),
        ),
      }
    }
    case INITIALIZED: {
      const blueprint = createBlueprint()
      const blueprints = { [blueprint.uid]: blueprint }
      return createBlueprintState({ blueprints })
    }
    case PORT_CHANGED: {
      const {
        uid,
        name,
        properties,
      } = action
      const { nodes } = state
      const node = nodes[uid]
      if (node) {
        return {
          ...state,
          nodes: {
            ...nodes,
            [uid]: changePort(node, name, properties),
          },
        }
      }
      return state
    }
    case NODE_ADDED: {
      const { node } = action
      const { currentBlueprintId } = state
      return {
        ...state,
        currentNodeIds: [...state.currentNodeIds, node.uid],
        nodes: {
          ...state.nodes,
          [node.uid]: {
            ...node,
            blueprintId: currentBlueprintId,
          },
        },
      }
    }
    case NODE_CHANGED: {
      const { uid, properties } = action
      const { nodes } = state
      const node = nodes[uid]
      if (node) {
        return {
          ...state,
          nodes: {
            ...nodes,
            [uid]: {
              ...node,
              ...properties,
            },
          },
        }
      }
      return state
    }
    case NODE_DELETED: {
      const { uid } = action
      const nodes = { ...state.nodes }
      delete nodes[uid]
      return {
        ...state,
        connections: state.connections.filter((conn) => (
          conn.sourceNodeId !== uid
          && conn.targetNodeId !== uid
        )),
        currentNodeIds: state.currentNodeIds.filter((nodeId) => nodeId !== uid),
        nodes,
      }
    }
    default:
      return state
  }
}
