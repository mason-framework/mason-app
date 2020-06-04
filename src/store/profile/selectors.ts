import { v4 as uuid4 } from 'uuid'
import _reduce from 'lodash/reduce'
import _values from 'lodash/values'
import { createSelector } from 'reselect'

import {
  EVENT_NODE_ENTERED,
  EVENT_NODE_EXITED,
  EVENT_NODE_ERRORED,
  STATUS_RUNNING,
  STATUS_ERROR,
  STATUS_OK,
  NodeTimeline,
  TimelineEvent,
  Event,
} from 'store/profile/types'
import { getNodes } from 'store/blueprint/selectors'
import { ReduxState } from 'store/types'


const DEFAULT_EVENT: TimelineEvent = {
  endedAt: 0,
  startedAt: 0,
  status: STATUS_ERROR,
  uid: uuid4(),
}


export const getEvents = ({ profile }: ReduxState): Array<Event> => profile.events
export const getEnabled = ({ profile }: ReduxState): boolean => profile.enabled
export const getRequestTime = ({ profile }: ReduxState): number => profile.requestTime
export const getActive = ({ profile }: ReduxState): boolean => profile.enabled && profile.active


export const getFirstEvent = createSelector(
  getEvents,
  (events): Event | undefined => (events.length ? events[0] : undefined),
)


export const getLastEvent = createSelector(
  getEvents,
  (events): Event | undefined => (events.length ? events[events.length - 1] : undefined),
)


export const getInitialTime = createSelector(
  getFirstEvent,
  (event): number => (event ? event.occurredAt : 0),
)


export const getTotalTime = createSelector(
  getFirstEvent,
  getLastEvent,
  (first, last): number => (first && last ? last.occurredAt - first.occurredAt : 0),
)


export const getActiveNodeIds = createSelector(
  getEvents,
  getActive,
  (events, active): Array<string> => {
    if (!active) {
      return []
    }
    const nodeStates = _reduce(
      events,
      (
        acc: Record<string, number>,
        event: Event,
      ): Record<string, number> => {
        const key = event.nodeId || ''
        switch (event.eventType) {
          case EVENT_NODE_ENTERED: {
            acc[key] = acc[key] ? acc[key] + 1 : 1
            return acc
          }
          case EVENT_NODE_EXITED: {
            acc[key] -= 1
            return acc
          }
        }
        return acc
      },
      {},
    )
    return _reduce(nodeStates, (acc: Array<string>, value: number, key: string) => {
      if (value > 0) {
        acc.push(key)
      }
      return acc
    }, [])
  },
)


export const getMappedEvents = createSelector(
  getEvents,
  getInitialTime,
  (events, offset) => events.map((event) => ({
    ...event,
    occuredAt: event.occurredAt - offset,
  })),
)


export const getTimeline = createSelector(
  getNodes,
  getEvents,
  getInitialTime,
  (nodes, events, initial): Array<NodeTimeline> => _values(
    _reduce(
      events,
      (acc: Record<string, NodeTimeline>, event: Event): Record<string, NodeTimeline> => {
        const { eventType, nodeId } = event
        const key = nodeId || ''
        const { label } = nodes[key] || { label: key }
        switch (eventType) {
          case EVENT_NODE_ENTERED: {
            if (!acc[key]) {
              acc[key] = {
                uid: key,
                label,
                stack: [],
                events: [],
              }
            }
            acc[key].stack.push({
              startedAt: event.occurredAt - initial,
              status: STATUS_RUNNING,
              uid: uuid4(),
            })
            break
          }
          case EVENT_NODE_EXITED: {
            if (acc[key]) {
              const ev: TimelineEvent = acc[key].stack.pop() || DEFAULT_EVENT
              acc[key].events.push({
                ...ev,
                endedAt: event.occurredAt - initial,
                status: STATUS_OK,
              })
            }
            break
          }
          case EVENT_NODE_ERRORED: {
            if (acc[key]) {
              const ev: TimelineEvent = acc[key].stack.pop() || DEFAULT_EVENT
              acc[key].events.push({
                ...ev,
                endedAt: event.occurredAt - initial,
                status: STATUS_ERROR,
              })
            }
            break
          }
        }
        return acc
      }, {},
    ),
  ),
)
