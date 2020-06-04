import {
  CONFIG_CHANGED,
  CONFIG_TOGGLED,
  INITIALIZED,
  WORKFLOW_CLOSED,
  WORKFLOW_OPENED,
  WORKFLOW_TAB_CHANGED,
  WORKFLOW_TOGGLED,
  AppAction,
  AppState,
} from 'store/app/types'

import { setupClient } from 'store/app/api'

const initialState: AppState = {
  config: {
    locale: 'en-us',
    apiHost: 'http://localhost:8000',
    apiToken: '',
    theme: 'dark',
  },
  configVisible: false,
  workflowVisible: false,
  workflowTab: 'runs',
}

export function appReducer(state = initialState, action: AppAction): AppState {
  switch (action.type) {
    case INITIALIZED: {
      const { config } = state
      setupClient(config.apiHost, config.apiToken)
      return state
    }
    case CONFIG_CHANGED: {
      const { config } = action
      setupClient(config.apiHost, config.apiToken)
      return { ...state, config }
    }
    case CONFIG_TOGGLED: {
      return { ...state, configVisible: !state.configVisible }
    }
    case WORKFLOW_OPENED: {
      const { tab } = action
      return { ...state, workflowVisible: true, workflowTab: tab || state.workflowTab }
    }
    case WORKFLOW_TAB_CHANGED: {
      const { tab } = action
      return { ...state, workflowTab: tab }
    }
    case WORKFLOW_CLOSED: {
      return { ...state, workflowVisible: false }
    }
    case WORKFLOW_TOGGLED: {
      const { workflowVisible } = state
      return { ...state, workflowVisible: !workflowVisible }
    }
    default:
      return state
  }
}
