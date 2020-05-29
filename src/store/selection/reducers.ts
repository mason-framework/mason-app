import {
  SELECTION_ADDED,
  SELECTION_CLEARED,
  SelectionAction,
  SelectionState,
} from 'store/selection/types'

const initialState: SelectionState = {
  selection: [],
}

export function selectionReducer(
  state = initialState,
  action: SelectionAction,
): SelectionState {
  switch (action.type) {
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
