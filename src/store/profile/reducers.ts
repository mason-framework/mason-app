import {
  RUN_STARTED,
  RUN_FINISHED,
  RUN_CANCELLED,
  RunAction,
} from 'store/runs/types'
import {
  EVENTS_ADDED,
  EVENTS_CLEARED,
  PROFILE_ENABLED,
  PROFILE_TOGGLED,
  REQUEST_TIME_CHANGED,
  ProfileAction,
  ProfileState,
} from 'store/profile/types'

const initialState: ProfileState = {
  requestTime: 0,
  enabled: true,
  active: false,
  events: [],
}

export function profileReducer(
  state = initialState,
  action: ProfileAction | RunAction,
): ProfileState {
  switch (action.type) {
    case EVENTS_ADDED: {
      const { events } = action
      return { ...state, events: [...state.events, ...events] }
    }
    case EVENTS_CLEARED: {
      return { ...state, events: [] }
    }
    case REQUEST_TIME_CHANGED: {
      const { requestTime } = action
      return { ...state, requestTime }
    }
    case RUN_STARTED: {
      return {
        ...state,
        events: [],
        active: true,
        requestTime: 0,
      }
    }
    case RUN_FINISHED: {
      return { ...state, active: false }
    }
    case RUN_CANCELLED: {
      return { ...state, active: false }
    }
    case PROFILE_ENABLED: {
      const { enabled } = action
      return { ...state, enabled }
    }
    case PROFILE_TOGGLED: {
      return { ...state, enabled: !state.enabled }
    }
    default:
      return state
  }
}
