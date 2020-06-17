import {
  BLUEPRINT_LOADED,
  NODE_ADDED,
  BlueprintAction,
} from 'store/blueprint/types'
import {
  SELECTION_ADDED,
  SELECTION_COPIED,
  SELECTION_CUT,
  SELECTION_CLEARED,
  SELECTION_COPY_CLEARED,
  SelectionAction,
  SelectionState,
} from 'store/selection/types'

const createState = (): SelectionState => ({
  selection: [],
  copy: {
    selection: [],
    mode: '',
  },
})

const initialState: SelectionState = createState()

export function selectionReducer(
  state = initialState,
  action: SelectionAction | BlueprintAction,
): SelectionState {
  switch (action.type) {
    case BLUEPRINT_LOADED: {
      return createState()
    }
    case NODE_ADDED: {
      const { node } = action
      return { ...state, selection: [node.uid] }
    }
    case SELECTION_ADDED: {
      const { uid } = action
      return { ...state, selection: [uid] }
    }
    case SELECTION_CLEARED: {
      return { ...state, selection: [] }
    }
    case SELECTION_COPIED: {
      const { selection } = state
      return { ...state, copy: { selection: [...selection], mode: 'copy' } }
    }
    case SELECTION_CUT: {
      const { selection } = state
      return { ...state, copy: { selection: [...selection], mode: 'cut' } }
    }
    case SELECTION_COPY_CLEARED: {
      const { copy } = state
      if (copy.mode === 'cut') {
        return { ...state, copy: { selection: [], mode: '' } }
      }
      return state
    }
    default:
      return state
  }
}
