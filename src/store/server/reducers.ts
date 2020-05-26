import { Library as _Library } from 'store/server/proto/library'
import {
  LIBRARY_LOADED,
  ServerAction,
  ServerState,
} from 'store/server/types'

const initialState: ServerState = {
  library: _Library.fromJSON({}),
}

export function serverReducer(
  state = initialState,
  action: ServerAction,
): ServerState {
  switch (action.type) {
    case LIBRARY_LOADED: {
      const { library } = action
      return { ...state, library }
    }
    default:
      return state
  }
}
