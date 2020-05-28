import { createSelector } from 'reselect'
import {
  Blueprint,
  Node,
} from 'store/blueprint/types'
import { getSelectedNodeId } from 'store/graph/selectors'
import { ReduxState } from 'store/types'

export const getBlueprints = (
  ({ blueprint }: ReduxState): Record<string, Blueprint> => blueprint.blueprints
)

export const getNodes = (
  ({ blueprint }: ReduxState): Record<string, Node> => blueprint.nodes
)

export const getCurrentBlueprintId = (
  ({ blueprint }: ReduxState): string => blueprint.currentBlueprintId
)

export const getBreadcrumbs = () => ['Untitled']

export const getSelectedNode = createSelector(
  getNodes,
  getSelectedNodeId,
  (nodes, uid): Node | undefined => nodes[uid],
)
