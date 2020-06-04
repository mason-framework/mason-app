import { createSelector } from 'reselect'

import { STATUS_RUNNING, Run } from 'store/runs/types'
import { ReduxState } from 'store/types'

export const getRuns = ({ runs }: ReduxState): Array<Run> => runs.runs

export const getCurrentRunId = createSelector(
  getRuns,
  (runs): string => {
    const run = runs[runs.length - 1]
    if (run && run.status === STATUS_RUNNING) {
      return run.uid
    }
    return ''
  },
)

export const getIsRunning = createSelector(
  getCurrentRunId,
  (uid): boolean => !!uid,
)
