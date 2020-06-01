import {
  LOCALE_DEFAULT,
  LOCALE_CHANGED,
  WORKFLOW_CLOSED,
  WORKFLOW_OPENED,
  WORKFLOW_TOGGLED,
  AppAction,
  AppState,
} from 'store/app/types'

const initialState: AppState = {
  locale: LOCALE_DEFAULT,
  workflowVisible: false,
}

export function appReducer(state = initialState, action: AppAction): AppState {
  switch (action.type) {
    case LOCALE_CHANGED: {
      const { locale } = action
      return { ...state, locale }
    }
    case WORKFLOW_OPENED: {
      return { ...state, workflowVisible: true }
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
