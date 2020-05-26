import { LibraryNode } from 'store/server/types'

export const LIBRARY_NODE_DRAGGED = '@@tree/LIBRARY_NODE_DRAGGED'
export const LIBRARY_NODE_SEARCHED = '@@tree/LIBRARY_NODE_SEARCHED'

// Models
export interface LibraryNodeTreeItemModel {
  key: string
  title: string | React.ReactNode
  children: Array<LibraryNodeTreeItemModel>
}

// Actions
export interface LibraryNodeDraggedAction {
  type: typeof LIBRARY_NODE_DRAGGED
  nodeType: LibraryNode
}

export interface LibraryNodeSearchedAction {
  type: typeof LIBRARY_NODE_SEARCHED
  terms: string
}

export type TreeAction = LibraryNodeDraggedAction | LibraryNodeSearchedAction

export interface TreeState {
  nodeSearch: string
}
