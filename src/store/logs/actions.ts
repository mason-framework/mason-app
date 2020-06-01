import {
  LOG_ADDED,
  LOGS_CLEARED,
  LOG_LEVEL_CHANGED,
  LogAction,
} from 'store/logs/types'


export const addLog = (text: string): LogAction => ({
  type: LOG_ADDED,
  text,
})

export const clearLogs = (): LogAction => ({
  type: LOGS_CLEARED,
})

export const changeLevel = (level: string): LogAction => ({
  type: LOG_LEVEL_CHANGED,
  level,
})
