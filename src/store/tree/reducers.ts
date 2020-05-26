import {
  LIBRARY_NODE_SEARCHED,
  TreeAction,
  TreeState,
} from 'store/tree/types'

const initialState: TreeState = {
  nodeSearch: '',
}

export function treeReducer(
  state = initialState,
  action: TreeAction,
): TreeState {
  switch (action.type) {
    case LIBRARY_NODE_SEARCHED: {
      const { terms } = action
      return { ...state, nodeSearch: terms }
    }
    default:
      return state
  }
}
