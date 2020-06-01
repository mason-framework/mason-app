import {
  INITIALIZED,
  LOCALE_CHANGED,
  WORKFLOW_CLOSED,
  WORKFLOW_OPENED,
  WORKFLOW_TOGGLED,
  AppAction,
} from 'store/app/types'

export const initialize = (): AppAction => ({
  type: INITIALIZED,
})

export const changeLocale = (locale: string): AppAction => ({
  type: LOCALE_CHANGED,
  locale,
})

export const closeWorkflow = (): AppAction => ({
  type: WORKFLOW_CLOSED,
})

export const openWorkflow = (): AppAction => ({
  type: WORKFLOW_OPENED,
})

export const toggleWorkflow = (): AppAction => ({
  type: WORKFLOW_TOGGLED,
})
