import {
  Library as _Library,
  Port as _LibraryPort,
  Node as _LibraryNode,
  Blueprint as _LibraryBlueprint,
} from 'store/server/proto/library'

export const LIBRARY_LOADED = '@@server/LIBRARY_LOADED'

// Models
export interface Library extends _Library {}
export interface LibraryNode extends _LibraryNode {}
export interface LibraryPort extends _LibraryPort {}
export interface LibraryBlueprint extends _LibraryBlueprint {}

// Actions
interface LibraryLoadedAction {
  type: typeof LIBRARY_LOADED
  library: Library
}

export type ServerAction = LibraryLoadedAction

// States
export interface ServerState {
  library: Library,
}
