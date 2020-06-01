import {
  LOG_ADDED,
  LOGS_CLEARED,
  LOG_LEVEL_CHANGED,
  LogAction,
  LogsState,
} from 'store/logs/types'


const initialState: LogsState = {
  logs: [],
  level: 'INFO',
}

export function logsReducer(
  state = initialState,
  action: LogAction,
): LogsState {
  switch (action.type) {
    case LOG_ADDED: {
      const { text } = action
      return { ...state, logs: [...state.logs, text] }
    }
    case LOG_LEVEL_CHANGED: {
      const { level } = action
      return { ...state, level }
    }
    case LOGS_CLEARED: {
      return { ...state, logs: [] }
    }
    default:
      return state
  }
}
