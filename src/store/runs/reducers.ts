import _findIndex from 'lodash/findIndex'
import {
  RUN_STARTED,
  RUN_FINISHED,
  RUN_CANCELLED,
  RUNS_CLEARED,
  STATUS_RUNNING,
  STATUS_CANCELLED,
  RunAction,
  RunState,
  Run,
} from 'store/runs/types'

const initialState: RunState = {
  runs: [],
}

function updateRun(state: RunState, uid: string, options: any): RunState {
  const { runs } = state
  const index = _findIndex(runs, (run: Run) => run.uid === uid)
  const run = runs[index]
  if (run && run.uid === uid) {
    return {
      ...state,
      runs: [
        ...runs.slice(0, index),
        {
          ...run,
          ...options,
        },
        ...runs.slice(index + 1, runs.length),
      ],
    }
  }
  return state
}

export function runsReducer(
  state = initialState,
  action: RunAction,
): RunState {
  switch (action.type) {
    case RUNS_CLEARED: {
      return { ...state, runs: [] }
    }
    case RUN_STARTED: {
      const { uid, inputs } = action
      return {
        ...state,
        runs: [
          ...state.runs,
          {
            uid,
            inputs,
            status: STATUS_RUNNING,
          },
        ],
      }
    }
    case RUN_FINISHED: {
      const { uid, result, status } = action
      return updateRun(state, uid, { result, status })
    }
    case RUN_CANCELLED: {
      const { uid } = action
      return updateRun(state, uid, { status: STATUS_CANCELLED })
    }
    default:
      return state
  }
}
