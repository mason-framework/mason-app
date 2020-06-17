import { AppState } from 'store/app/types'
import { BlueprintState } from 'store/blueprint/types'
import { StorageState } from 'store/storage/types'
import { GraphState } from 'store/graph/types'
import { LibraryState } from 'store/library/types'
import { LogsState } from 'store/logs/types'
import { ProfileState } from 'store/profile/types'
import { SelectionState } from 'store/selection/types'
import { RunState } from 'store/runs/types'

export interface ReduxState {
  app: AppState
  blueprint: BlueprintState
  graph: GraphState
  library: LibraryState
  logs: LogsState
  profile: ProfileState
  runs: RunState
  selection: SelectionState
  storage: StorageState
}
