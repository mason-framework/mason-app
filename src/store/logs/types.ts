export const LOG_ADDED = '@@logs/ADDED'
export const LOGS_CLEARED = '@@logs/CLEARED'
export const LOG_LEVEL_CHANGED = '@@logs/LEVEL_CHANGED'
export const LOGS_TOGGLED = '@@logs/TOGGLED'
export const LOGS_ENABLED = '@@logs/ENABLED'


interface AddLogAction {
  type: typeof LOG_ADDED
  text: string
}

interface ClearLogAction {
  type: typeof LOGS_CLEARED
}

interface ChangeLevelAction {
  type: typeof LOG_LEVEL_CHANGED
  level: string
}

interface EnableLogsAction {
  type: typeof LOGS_ENABLED
  enabled: boolean
}

interface ToggleLogsAction {
  type: typeof LOGS_TOGGLED
}

export type LogAction =
  AddLogAction |
  ChangeLevelAction |
  ClearLogAction |
  EnableLogsAction |
  ToggleLogsAction

export interface LogsState {
  enabled: boolean
  logs: Array<string>
  level: string
}
