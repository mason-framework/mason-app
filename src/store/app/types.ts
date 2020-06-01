export const INITIALIZED = '@@app/INITIALIZED'

export const LOCALE_CHANGED = '@@app/LOCALE_CHANGED'

export const WORKFLOW_OPENED = '@@app/WORKFLOW_OPENED'
export const WORKFLOW_CLOSED = '@@app/WORKFLOW_CLOSED'
export const WORKFLOW_TOGGLED = '@@app/WORKFLOW_TOGGLED'

export const LOCALE_EN_US = 'en-us'
export const LOCALE_DEFAULT = LOCALE_EN_US

export interface InitializeAction {
  type: typeof INITIALIZED
}

export interface ChangeLocaleAction {
  type: typeof LOCALE_CHANGED
  locale: string
}

export interface CloseWorkflowAction {
  type: typeof WORKFLOW_CLOSED
}

export interface OpenWorkflowAction {
  type: typeof WORKFLOW_OPENED
}

export interface ToggleWorkflowAction {
  type: typeof WORKFLOW_TOGGLED
}

export type AppAction =
  ChangeLocaleAction |
  CloseWorkflowAction |
  InitializeAction |
  OpenWorkflowAction |
  ToggleWorkflowAction

export interface AppState {
  locale: string
  workflowVisible: boolean
}
