import { getClient } from 'store/app/api'

import { ServerBlueprint } from 'store/blueprint/io'
import { finishRun } from 'store/runs/actions'
import {
  STATUS_OK,
  STATUS_ERROR,
  ExecutionResult,
  RunAction,
} from 'store/runs/types'


export async function runBlueprint(
  blueprint: ServerBlueprint,
  uid: string,
  inputs: Record<string, any> | undefined,
  level: string,
): Promise<RunAction | undefined> {
  const data = {
    blueprint,
    inputs,
    level,
  }
  const client = getClient()
  const response = client.post(
    '/blueprints/execute',
    data,
    {
      headers: {
        'X-Request-ID': uid,
      },
    },
  )
  try {
    const { data: responseData } = await response
    const result: ExecutionResult = {
      output: responseData,
      error: undefined,
    }
    return finishRun(uid, STATUS_OK, result)
  } catch (error) {
    const result: ExecutionResult = {
      output: undefined,
      error,
    }
    return finishRun(uid, STATUS_ERROR, result)
  }
}
