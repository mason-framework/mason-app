export const LOG_ADDED = '@@logs/ADDED'
export const LOGS_CLEARED = '@@logs/CLEARED'
export const LOG_LEVEL_CHANGED = '@@logs/LEVEL_CHANGED'


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

export type LogAction =
  AddLogAction |
  ChangeLevelAction |
  ClearLogAction

export interface LogsState {
  logs: Array<string>
  level: string
}
