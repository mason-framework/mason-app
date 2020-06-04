// Constants
export const EVENTS_ADDED = '@@profile/EVENTS_ADDED'
export const EVENTS_CLEARED = '@@profile/EVENTS_CLEARED'
export const PROFILE_ENABLED = '@@profile/ENABLED'
export const PROFILE_TOGGLED = '@@profile/TOGGLED'
export const REQUEST_TIME_CHANGED = '@@profile/REQUEST_TIME_CHANGED'

// Server Events
export const EVENT_NODE_ENTERED = 'NodeEntered'
export const EVENT_NODE_EXITED = 'NodeExited'
export const EVENT_NODE_ERRORED = 'NodeErrored'

export const STATUS_RUNNING = 'running'
export const STATUS_OK = 'ok'
export const STATUS_ERROR = 'errored'

// Models
export interface Event {
  occurredAt: number
  eventType: string
  nodeId?: string
}

export interface TimelineEvent {
  startedAt: number
  endedAt?: number
  status: string
  uid: string
}

export interface NodeTimeline {
  uid: string
  label: string
  stack: Array<TimelineEvent>
  events: Array<TimelineEvent>
}

// Actions
interface AddEventsAction {
  type: typeof EVENTS_ADDED
  events: Array<Event>
}

interface ClearEventsAction {
  type: typeof EVENTS_CLEARED
}

export interface EnableProfileAction {
  type: typeof PROFILE_ENABLED
  enabled: boolean
}

interface ChangeRequestTimeAction {
  type: typeof REQUEST_TIME_CHANGED
  requestTime: number
}

interface ToggleProfileAction {
  type: typeof PROFILE_TOGGLED
}

export type ProfileAction =
  AddEventsAction |
  ChangeRequestTimeAction |
  ClearEventsAction |
  EnableProfileAction |
  ToggleProfileAction

// State
export interface ProfileState {
  active: boolean
  enabled: boolean
  events: Array<Event>
  requestTime: number
}
