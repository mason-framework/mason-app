import {
  LIBRARY_LOADED,
  LIBRARY_SEARCHED,
  LibraryAction,
  LibraryState,
} from 'store/library/types'

const initialState: LibraryState = {
  nodes: [],
  searchTerms: '',
}

export function libraryReducer(
  state = initialState,
  action: LibraryAction,
): LibraryState {
  switch (action.type) {
    case LIBRARY_LOADED: {
      const { library } = action
      return { ...state, nodes: library.nodes }
    }
    case LIBRARY_SEARCHED: {
      const { searchTerms } = action
      return { ...state, searchTerms }
    }
    default:
      return state
  }
}
