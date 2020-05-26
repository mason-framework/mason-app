import { createSelector } from 'reselect'
import { ReduxState } from 'store/types'

import {
  ServerState,
  Library,
  LibraryNode,
} from 'store/server/types'

export const getServer = ({ server }: ReduxState): ServerState => server

export const getLibrary = createSelector(
  getServer, ({ library }: ServerState): Library => library,
)

export const getLibraryNodes = createSelector(
  getLibrary, ({ nodes }: Library): Array<LibraryNode> => nodes,
)
