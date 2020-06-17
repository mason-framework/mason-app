import _get from 'lodash/get'
import { createSelector } from 'reselect'

import {
  BlueprintState,
  Connection,
  Node,
} from 'store/blueprint/types'
import { ReduxState } from 'store/types'


export const getPresent = ({ blueprint }: ReduxState): BlueprintState => _get(blueprint, 'present')

export const getConnections = createSelector(
  getPresent,
  ({ connections }): Array<Connection> => connections,
)
export const getNodes = createSelector(
  getPresent,
  ({ nodes }): Record<string, Node> => nodes,
)
