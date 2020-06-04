import {
  EVENTS_ADDED,
  EVENTS_CLEARED,
  PROFILE_ENABLED,
  PROFILE_TOGGLED,
  REQUEST_TIME_CHANGED,
  Event,
  ProfileAction,
} from 'store/profile/types'


export const addEvents = (events: Array<Event>): ProfileAction => ({
  type: EVENTS_ADDED,
  events,
})

export const changeRequestTime = (requestTime: number): ProfileAction => ({
  type: REQUEST_TIME_CHANGED,
  requestTime,
})

export const clearEvents = (): ProfileAction => ({
  type: EVENTS_CLEARED,
})


export const changeEnabled = (enabled: boolean): ProfileAction => ({
  type: PROFILE_ENABLED,
  enabled,
})

export const enableProfile = (): ProfileAction => changeEnabled(true)
export const disableProfile = (): ProfileAction => changeEnabled(false)

export const toggleProfile = (): ProfileAction => ({
  type: PROFILE_TOGGLED,
})
