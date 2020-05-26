import {
  LIBRARY_LOADED,
  Library,
  ServerAction,
} from 'store/server/types'

export const libraryLoaded = (library: Library): ServerAction => ({
  type: LIBRARY_LOADED,
  library,
})
