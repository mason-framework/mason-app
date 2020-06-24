import EN_US from 'translations/en-us.json'

// Constants
export const INITIALIZED = '@@app/INITIALIZED'

export const CONFIG_CHANGED = '@@app/CONFIG_CHANGED'
export const CONFIG_TOGGLED = '@@app/CONFIG_TOGGLED'

export const OPERATIONS_CANCELLED = '@@app/OPERATIONS_CANCELLED'

export const WORKFLOW_OPENED = '@@app/WORKFLOW_OPENED'
export const WORKFLOW_TAB_CHANGED = '@@app/WORKFLOW_TAB_CHANGED'
export const WORKFLOW_CLOSED = '@@app/WORKFLOW_CLOSED'
export const WORKFLOW_TOGGLED = '@@app/WORKFLOW_TOGGLED'

export const MESSAGE_CATALOG: Record<string, Record<string, string>> = {
  'en-us': EN_US,
}

export const LOCALES: Array<string> = [
  'en-us',
]

export const THEMES: Array<string> = [
  'dark',
]

// Models
export interface Config {
  locale: string
  theme: string
  apiHost: string
  apiToken: string
}

// Actions
export interface InitializeAction {
  type: typeof INITIALIZED
}

interface CancelOperationsAction {
  type: typeof OPERATIONS_CANCELLED
}

interface ChangeConfigAction {
  type: typeof CONFIG_CHANGED
  config: Config
}

export interface ChangeWorkflowTabAction {
  type: typeof WORKFLOW_TAB_CHANGED
  tab: string
}

export interface CloseWorkflowAction {
  type: typeof WORKFLOW_CLOSED
}

export interface OpenWorkflowAction {
  type: typeof WORKFLOW_OPENED
  tab: string
}

export interface ToggleConfigAction {
  type: typeof CONFIG_TOGGLED
}

export interface ToggleWorkflowAction {
  type: typeof WORKFLOW_TOGGLED
}

export type AppAction =
  CancelOperationsAction |
  ChangeConfigAction |
  ChangeWorkflowTabAction |
  CloseWorkflowAction |
  InitializeAction |
  OpenWorkflowAction |
  ToggleConfigAction |
  ToggleWorkflowAction

// State
export interface AppState {
  config: Config
  configVisible: boolean
  workflowVisible: boolean
  workflowTab: string
}
