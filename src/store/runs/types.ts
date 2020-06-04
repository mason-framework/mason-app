// Constants
export const STATUS_RUNNING = 'running'
export const STATUS_OK = 'ok'
export const STATUS_CANCELLED = 'cancelled'
export const STATUS_ERROR = 'error'

// Action Types
export const RUN_STARTED = '@@runs/STARTED'
export const RUN_FINISHED = '@@runs/FINISHED'
export const RUN_CANCELLED = '@@runs/CANCELLED'
export const RUNS_CLEARED = '@@runs/CLEARED'

// Models
export interface Error {
  type: string
  message: string
  traceback: string
}

export interface ExecutionResult {
  output?: any
  error?: Error
}

export interface Run {
  uid: string
  inputs?: Record<string, any>
  result?: ExecutionResult
  status: string
}


// Actions
interface CancelRunAction {
  type: typeof RUN_CANCELLED
  uid: string
}

interface ClearRunsAction {
  type: typeof RUNS_CLEARED
}

export interface StartRunAction {
  type: typeof RUN_STARTED
  inputs?: Record<string, any>
  uid: string
}

interface FinishRunAction {
  type: typeof RUN_FINISHED
  uid: string
  result?: ExecutionResult
  status: string
}

export type RunAction =
  CancelRunAction |
  ClearRunsAction |
  StartRunAction |
  FinishRunAction

// Store
export interface RunState {
  runs: Array<Run>
}
