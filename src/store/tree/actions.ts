import {
  LIBRARY_NODE_DRAGGED,
  LIBRARY_NODE_SEARCHED,
  TreeAction,
} from 'store/tree/types'
import { LibraryNode } from 'store/server/types'

export const dragLibraryNode = (nodeType: LibraryNode): TreeAction => ({
  type: LIBRARY_NODE_DRAGGED,
  nodeType,
})

export const searchLibraryNode = (terms: string): TreeAction => ({
  type: LIBRARY_NODE_SEARCHED,
  terms,
})
