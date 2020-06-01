import { AppState } from 'store/app/types'
import { BlueprintState } from 'store/blueprint/types'
import { GraphState } from 'store/graph/types'
import { LibraryState } from 'store/library/types'
import { LogsState } from 'store/logs/types'
import { SelectionState } from 'store/selection/types'

export interface ReduxState {
  app: AppState,
  blueprint: BlueprintState,
  graph: GraphState,
  library: LibraryState,
  logs: LogsState,
  selection: SelectionState,
}
