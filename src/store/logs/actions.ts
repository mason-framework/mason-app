import {
  LOG_ADDED,
  LOGS_CLEARED,
  LOG_LEVEL_CHANGED,
  LOGS_TOGGLED,
  LOGS_ENABLED,
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

export const setEnabled = (enabled: boolean): LogAction => ({
  type: LOGS_ENABLED,
  enabled,
})

export const enableLogs = (): LogAction => setEnabled(true)
export const disableLogs = (): LogAction => setEnabled(false)

export const toggleLogs = (): LogAction => ({
  type: LOGS_TOGGLED,
})
