import { v4 as uuid4 } from 'uuid'
import {
  RUN_STARTED,
  RUN_FINISHED,
  RUN_CANCELLED,
  RUNS_CLEARED,
  ExecutionResult,
  RunAction,
} from 'store/runs/types'


export const clearRuns = (): RunAction => ({
  type: RUNS_CLEARED,
})

export const startRun = (
  inputs: Record<string, any> | undefined = undefined,
  uid: string | undefined = undefined,
): RunAction => ({
  type: RUN_STARTED,
  uid: uid || uuid4(),
  inputs,
})

export const finishRun = (
  uid: string,
  status: string,
  result: ExecutionResult | undefined = undefined,
): RunAction => ({
  type: RUN_FINISHED,
  uid,
  status,
  result,
})

export const cancelRun = (
  uid: string,
): RunAction => ({
  type: RUN_CANCELLED,
  uid,
})
