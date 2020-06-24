import {
  CONFIG_CHANGED,
  CONFIG_TOGGLED,
  INITIALIZED,
  OPERATIONS_CANCELLED,
  WORKFLOW_CLOSED,
  WORKFLOW_OPENED,
  WORKFLOW_TOGGLED,
  WORKFLOW_TAB_CHANGED,
  Config,
  AppAction,
} from 'store/app/types'

export const cancelOperations = (): AppAction => ({
  type: OPERATIONS_CANCELLED,
})

export const initialize = (): AppAction => ({
  type: INITIALIZED,
})

export const changeConfig = (config: Config): AppAction => ({
  type: CONFIG_CHANGED,
  config,
})

export const changeWorkflowTab = (tab: string): AppAction => ({
  type: WORKFLOW_TAB_CHANGED,
  tab,
})

export const closeWorkflow = (): AppAction => ({
  type: WORKFLOW_CLOSED,
})

export const openWorkflow = (tab: string = ''): AppAction => ({
  type: WORKFLOW_OPENED,
  tab,
})

export const toggleConfig = (): AppAction => ({
  type: CONFIG_TOGGLED,
})

export const toggleWorkflow = (): AppAction => ({
  type: WORKFLOW_TOGGLED,
})
