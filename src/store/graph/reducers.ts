import {
  CONNECTOR_FINISHED,
  CONNECTOR_MOVED,
  CONNECTOR_STARTED,
  NODE_DELTA_CLEARED,
  NODE_MOVED,
  SUGGESTIONS_CLEARED,
  SUGGESTIONS_SEARCHED,
  SUGGESTIONS_SHOWN,
  GraphAction,
  GraphState,
  createGraphState,
} from 'store/graph/types'
import {
  INITIALIZED,
  BlueprintAction,
  Connection,
  Hotspot,
} from 'store/blueprint/types'


const SOURCE_PLACEMENTS = ['right', 'bottom']
const INVERSE_PLACEMENT: Record<string, string> = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
}


function makeConnector(
  {
    nodeId,
    name,
    offsetX,
    offsetY,
    placement,
  }: Hotspot,
  x: number,
  y: number,
): Connection {
  const isSource = SOURCE_PLACEMENTS.includes(placement)
  return {
    sourceNodeId: isSource ? nodeId : '',
    sourceName: isSource ? name : '',
    sourcePlacement: isSource ? placement : INVERSE_PLACEMENT[placement],
    sourcePos: {
      x: x + (isSource ? 0 : offsetX),
      y: y + (isSource ? 0 : offsetY),
      offsetX: isSource ? offsetX : 0,
      offsetY: isSource ? offsetY : 0,
    },
    targetNodeId: isSource ? '' : nodeId,
    targetName: isSource ? '' : name,
    targetPlacement: isSource ? INVERSE_PLACEMENT[placement] : placement,
    targetPos: {
      x: x + (isSource ? offsetX : 0),
      y: y + (isSource ? offsetY : 0),
      offsetX: isSource ? 0 : offsetX,
      offsetY: isSource ? 0 : offsetY,
    },
    type: '',
  }
}


function moveConnector(connector: Connection, dx: number, dy: number): Connection {
  const {
    sourceNodeId,
    sourcePos,
    targetNodeId,
    targetPos,
  } = connector
  if (sourceNodeId) {
    const {
      x,
      y,
      offsetX,
      offsetY,
    } = sourcePos
    return {
      ...connector,
      targetPos: {
        x: x + dx + offsetX,
        y: y + dy + offsetY,
        offsetX: 0,
        offsetY: 0,
      },
    }
  }
  if (targetNodeId) {
    const {
      x,
      y,
      offsetX,
      offsetY,
    } = targetPos
    return {
      ...connector,
      sourcePos: {
        x: x + dx + offsetX,
        y: y + dy + offsetY,
        offsetX: 0,
        offsetY: 0,
      },
    }
  }
  return connector
}


const initialState: GraphState = createGraphState()

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
      if (connector) {
        const { dx, dy } = action
        return { ...state, connector: moveConnector(connector, dx, dy) }
      }
      return state
    }
    case SUGGESTIONS_SEARCHED: {
      const { terms } = action
      return { ...state, suggestionsSearch: terms }
    }
    case SUGGESTIONS_SHOWN: {
      const { suggestions, x, y } = action
      return { ...state, suggestions, suggestionsPosition: { x, y } }
    }
    case SUGGESTIONS_CLEARED: {
      return { ...state, suggestions: undefined, connector: undefined }
    }
    case CONNECTOR_STARTED: {
      const { hotspot, x, y } = action
      return { ...state, connector: makeConnector(hotspot, x, y) }
    }
    case INITIALIZED: {
      return createGraphState()
    }
    case NODE_MOVED: {
      const { uid, dx, dy } = action
      return {
        ...state,
        nodeDeltas: {
          ...state.nodeDeltas,
          [uid]: { dx, dy },
        },
      }
    }
    case NODE_DELTA_CLEARED: {
      const { uid } = action
      const nodeDeltas = { ...state.nodeDeltas }
      delete nodeDeltas[uid]
      return { ...state, nodeDeltas }
    }
    default:
      return state
  }
}
