import { v4 as uuid4 } from 'uuid'
import {
  BLUEPRINT_INITIALIZED,
  NODE_ADDED,
  NODE_DELETED,
  NODE_PROPERTY_CHANGED,
  PORT_VALUE_CHANGED,
  BlueprintAction,
  BlueprintState,
} from 'store/blueprint/types'


const initialState: BlueprintState = {
  blueprints: {},
  nodes: {},
  currentBlueprintId: '',
}

export function blueprintReducer(
  state = initialState,
  action: BlueprintAction,
): BlueprintState {
  switch (action.type) {
    case BLUEPRINT_INITIALIZED: {
      const blueprint = {
        label: 'Untitled',
        type: 'node.Blueprint',
        uid: uuid4(),
      }
      return {
        nodes: {},
        blueprints: {
          [blueprint.uid]: blueprint,
        },
        currentBlueprintId: blueprint.uid,
      }
    }
    case PORT_VALUE_CHANGED: {
      const { uid, portName, value } = action
      const { nodes } = state
      const node = nodes[uid]
      if (node) {
        const port = node.ports[portName]
        if (port) {
          return {
            ...state,
            nodes: {
              ...nodes,
              [uid]: {
                ...node,
                ports: {
                  ...node.ports,
                  [portName]: {
                    ...port,
                    value,
                  },
                },
              },
            },
          }
        }
      }
      return state
    }
    case NODE_ADDED: {
      const { node } = action
      const { currentBlueprintId } = state
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [node.uid]: {
            ...node,
            parentId: currentBlueprintId,
          },
        },
      }
    }
    case NODE_DELETED: {
      const { uid } = action
      const nodes = { ...state.nodes }
      delete nodes[uid]
      return { ...state, nodes }
    }
    case NODE_PROPERTY_CHANGED: {
      const { uid, property, value } = action
      const { nodes } = state
      const node = nodes[uid]
      if (node) {
        return {
          ...state,
          nodes: {
            ...nodes,
            [uid]: {
              ...node,
              [property]: value,
            },
          },
        }
      }
      return state
    }
    default:
      return state
  }
}
