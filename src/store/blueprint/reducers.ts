import {
  BLUEPRINT_LOADED,
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
    case BLUEPRINT_LOADED: {
      const { state: actionState } = action
      return { ...state, ...actionState }
    }
    case CONNECTION_ADDED: {
      const { connection } = action
      const connections = [...state.connections, connection]
      return { ...state, connections }
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
      return createBlueprintState()
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
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [node.uid]: node,
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
        nodes,
      }
    }
    default:
      return state
  }
}
