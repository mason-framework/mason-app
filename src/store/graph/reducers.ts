import {
  CONNECTOR_FINISHED,
  CONNECTOR_MOVED,
  CONNECTOR_STARTED,
  CONNECTION_ADDED,
  CONNECTION_DELETED,
  GRAPH_CLEARED,
  NODE_ADDED,
  NODE_DELETED,
  NODE_MOVE_FINISHED,
  NODE_MOVED,
  SELECTION_ADDED,
  SELECTION_CLEARED,
  GraphAction,
  GraphNode,
  GraphState,
} from 'store/graph/types'
import {
  NODE_PROPERTY_CHANGED,
  BlueprintAction,
} from 'store/blueprint/types'


const createState = (): GraphState => ({
  connector: undefined,
  deltas: {},
  nodes: [],
  connections: [],
  selection: [],
})

const initialState: GraphState = createState()

export function graphReducer(
  state = initialState,
  action: GraphAction | BlueprintAction,
): GraphState {
  switch (action.type) {
    case CONNECTOR_FINISHED: {
      return { ...state, connector: undefined }
    }
    case CONNECTOR_MOVED: {
      const { connector } = state
      const { dx, dy } = action
      if (connector && connector.source) {
        const {
          x,
          y,
          offsetX,
          offsetY,
        } = connector.sourcePos
        return {
          ...state,
          connector: {
            ...connector,
            targetPos: {
              x: x + dx + offsetX,
              y: y + dy + offsetY,
              offsetX: 0,
              offsetY: 0,
            },
          },
        }
      }
      if (connector && connector.target) {
        const {
          x,
          y,
          offsetX,
          offsetY,
        } = connector.targetPos
        return {
          ...state,
          connector: {
            ...connector,
            sourcePos: {
              x: x + dx + offsetX,
              y: y + dy + offsetY,
              offsetX: 0,
              offsetY: 0,
            },
          },
        }
      }
      return state
    }
    case CONNECTOR_STARTED: {
      const { connector } = action
      return { ...state, connector }
    }
    case CONNECTION_ADDED: {
      const { connection } = action
      return {
        ...state,
        connections: [...state.connections, connection],
      }
    }
    case CONNECTION_DELETED: {
      const { source, target } = action
      return {
        ...state,
        connections: state.connections.filter(
          (conn) => !(
            conn.source === source
            && conn.target === target
          ),
        ),
      }
    }
    case NODE_ADDED: {
      const { node } = action
      return {
        ...state,
        nodes: [...state.nodes, node],
      }
    }
    case NODE_DELETED: {
      const { uid } = action
      return {
        ...state,
        connections: state.connections.filter((conn) => (
          conn.source.split('.')[0] !== uid
          && conn.target.split('.')[0] !== uid
        )),
        nodes: state.nodes.filter((node) => node.uid !== uid),
      }
    }
    case NODE_PROPERTY_CHANGED: {
      const { uid, property, value } = action
      if (property === 'label') {
        return {
          ...state,
          nodes: state.nodes.map((node) => {
            if (uid === node.uid) {
              return ({
                ...node,
                label: value,
              })
            }
            return node
          }),
        }
      }
      return state
    }
    case NODE_MOVE_FINISHED: {
      const { uid } = action
      const { deltas: oldDeltas, nodes: old } = state
      const { dx, dy } = oldDeltas[uid] || { dx: 0, dy: 0 }
      const nodes = old.map((node: GraphNode): GraphNode => {
        if (node.uid === uid) {
          return {
            ...node,
            x: node.x + dx,
            y: node.y + dy,
          }
        }
        return node
      })
      const deltas = { ...oldDeltas }
      delete deltas[uid]
      return { ...state, deltas, nodes }
    }
    case NODE_MOVED: {
      const { uid, dx, dy } = action
      return {
        ...state,
        deltas: {
          ...state.deltas,
          [uid]: { dx, dy },
        },
      }
    }
    case GRAPH_CLEARED: {
      return createState()
    }
    case SELECTION_ADDED: {
      const { uid } = action
      return { ...state, selection: [uid] }
    }
    case SELECTION_CLEARED: {
      return { ...state, selection: [] }
    }
    default:
      return state
  }
}
