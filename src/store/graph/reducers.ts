import { v4 as uuid4 } from 'uuid'
import _findIndex from 'lodash/findIndex'
import {
  CONNECTION_ADDED,
  CONNECTION_CLEARED,
  CONNECTION_MOVED,
  CONNECTION_STARTED,
  GRAPH_NODE_MOVED,
  GRAPH_NODE_SELECTED,
  LIBRARY_NODE_DROPPED,
  GraphAction,
  GraphState,
} from 'store/graph/types'
import { raise } from '@vx/drag'


const initialState: GraphState = {
  connection: undefined,
  deltas: {},
  nodes: [],
  nodeConnections: [],
  selectedNodeId: '',
}

export function graphReducer(
  state = initialState,
  action: GraphAction,
): GraphState {
  switch (action.type) {
    case CONNECTION_ADDED: {
      const { connection } = action
      return { ...state, nodeConnections: [...state.nodeConnections, connection] }
    }
    case CONNECTION_STARTED: {
      const { connection } = action
      return { ...state, connection }
    }
    case CONNECTION_MOVED: {
      const { connection: curr } = state
      if (!curr) {
        return state
      }
      const { dx, dy } = action
      const connection = { ...curr }
      if (curr.source) {
        connection.targetX = (curr.sourceX || 0) + dx + (curr.sourceOffsetX || 0)
        connection.targetY = (curr.sourceY || 0) + dy + (curr.sourceOffsetY || 0)
      } else {
        connection.sourceX = (curr.targetX || 0) + dx + (curr.targetOffsetX || 0)
        connection.sourceY = (curr.targetY || 0) + dx + (curr.targetOffsetY || 0)
      }
      return { ...state, connection }
    }
    case CONNECTION_CLEARED: {
      return { ...state, connection: undefined }
    }
    case GRAPH_NODE_SELECTED: {
      const { nodes } = state
      const { uid } = action
      const index = _findIndex(nodes, ['uid', uid])
      return { ...state, nodes: raise(nodes, index), selectedNodeId: uid }
    }
    case LIBRARY_NODE_DROPPED: {
      const { nodeType, x, y } = action
      const uid = uuid4()
      const inputHotspots = []
      const outputHotspots = []
      const slots = nodeType.slots || []
      const signals = nodeType.signals || []
      const ports = nodeType.ports || []

      for (let i = 0; i < slots.length; i += 1) {
        const slot = nodeType.slots[i]
        inputHotspots.push({
          uid: `${uid}.${slot}`,
          direction: 'input',
          title: slot,
          offsetX: 1,
          offsetY: 20 + 18 * i,
          fill: 'blue',
        })
      }

      for (let i = 0; i < signals.length; i += 1) {
        const signal = nodeType.signals[i]
        outputHotspots.push({
          uid: `${uid}.${signal}`,
          direction: 'output',
          title: signal,
          offsetX: 149,
          offsetY: 20 + 18 * i,
          fill: 'red',
        })
      }

      for (const port of ports) {
        if (port.direction === 'input') {
          inputHotspots.push({
            uid: `${uid}.${port.name}`,
            direction: 'input',
            title: port.name,
            offsetX: 1,
            offsetY: 20 + 18 * inputHotspots.length,
            fill: '#1a1a1a',
          })
        } else {
          outputHotspots.push({
            uid: `${uid}.${port.name}`,
            direction: 'output',
            title: port.name,
            offsetX: 149,
            offsetY: 20 + 18 * outputHotspots.length,
            fill: '#1a1a1a',
          })
        }
      }

      const height = Math.max(
        25 + (inputHotspots.length * 18),
        25 + (outputHotspots.length * 18),
      )

      const node = {
        uid,
        nodeType: `${nodeType.group}.${nodeType.name}`,
        title: nodeType.name,
        x,
        y,
        width: 150,
        height,
        ports: nodeType.ports ? nodeType.ports.map((port) => ({
          direction: port.direction,
          localValue: port.default,
          map: port.map,
          name: port.name,
          sequence: port.sequence,
          type: port.type,
        })) : [],
        signals: nodeType.signals ? [...nodeType.signals] : [],
        slots: nodeType.slots ? [...nodeType.slots] : [],
        hotspots: [...inputHotspots, ...outputHotspots],
      }
      return { ...state, nodes: [...state.nodes, node] }
    }
    case GRAPH_NODE_MOVED: {
      const { deltas } = state
      const { uid, dx, dy } = action
      return {
        ...state,
        deltas: {
          ...deltas,
          [uid]: { dx, dy },
        },
      }
    }
    default:
      return state
  }
}
