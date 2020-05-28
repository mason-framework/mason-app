import { AppState } from 'store/app/types'
import { BlueprintState } from 'store/blueprint/types'
import { GraphState } from 'store/graph/types'
import { LibraryState } from 'store/library/types'

export interface ReduxState {
  app: AppState,
  blueprint: BlueprintState,
  graph: GraphState,
  library: LibraryState,
}
