import { AppState } from 'store/app/types'
import { GraphState } from 'store/graph/types'
import { ServerState } from 'store/server/types'
import { TreeState } from 'store/tree/types'

export interface ReduxState {
  app: AppState,
  graph: GraphState,
  server: ServerState,
  tree: TreeState,
}
