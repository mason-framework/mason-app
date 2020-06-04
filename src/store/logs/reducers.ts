import {
  LOG_ADDED,
  LOG_LEVEL_CHANGED,
  LOGS_CLEARED,
  LOGS_ENABLED,
  LOGS_TOGGLED,
  LogAction,
  LogsState,
} from 'store/logs/types'


const initialState: LogsState = {
  enabled: true,
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
    case LOGS_TOGGLED: {
      return { ...state, enabled: !state.enabled }
    }
    case LOGS_ENABLED: {
      const { enabled } = action
      return { ...state, enabled }
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
