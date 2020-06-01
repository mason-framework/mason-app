import _get from 'lodash/get'
import { createSelector } from 'reselect'

import {
  Blueprint,
  BlueprintState,
  Connection,
  Node,
} from 'store/blueprint/types'
import { ReduxState } from 'store/types'


export const getPresent = ({ blueprint }: ReduxState): BlueprintState => _get(blueprint, 'present')
export const getBlueprints = createSelector(
  getPresent,
  ({ blueprints }): Record<string, Blueprint> => blueprints,
)
export const getCurrentBlueprintId = createSelector(
  getPresent,
  ({ currentBlueprintId }): string => currentBlueprintId,
)
export const getCurrentNodeIds = createSelector(
  getPresent,
  ({ currentNodeIds }): Array<string> => currentNodeIds,
)
export const getConnections = createSelector(
  getPresent,
  ({ connections }): Array<Connection> => connections,
)
export const getNodes = createSelector(
  getPresent,
  ({ nodes }): Record<string, Node> => nodes,
)

export const getBreadcrumbs = createSelector(
  getBlueprints,
  getCurrentBlueprintId,
  (blueprints: Record<string, Blueprint>, uid: string): Array<string> => {
    let blueprint = blueprints[uid]
    const breadcrumbs = []
    while (blueprint) {
      breadcrumbs.push(blueprint.label)
      blueprint = blueprints[blueprint.parentId]
    }
    return breadcrumbs.reverse()
  },
)
