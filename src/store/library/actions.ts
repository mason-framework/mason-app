import {
  LIBRARY_LOADED,
  LIBRARY_NODE_DRAGGED,
  LIBRARY_SEARCHED,
  Library,
  NodeSchema,
  LibraryAction,
} from 'store/library/types'

export const loadLibrary = (library: Library): LibraryAction => ({
  type: LIBRARY_LOADED,
  library,
})

export const dragNodeSchema = (node: NodeSchema): LibraryAction => ({
  type: LIBRARY_NODE_DRAGGED,
  node,
})

export const searchLibrary = (searchTerms: string): LibraryAction => ({
  type: LIBRARY_SEARCHED,
  searchTerms,
})
