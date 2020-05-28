import React from 'react'
import {
  BlueprintSchema as _BlueprintSchema,
  Library as _Library,
  NodeSchema as _NodeSchema,
  PortSchema as _PortSchema,
} from 'store/library/proto/library'

export const LIBRARY_LOADED = '@@library/LOADED'
export const LIBRARY_NODE_DRAGGED = '@@library/NODE_DRAGGED'
export const LIBRARY_SEARCHED = '@@library/NODE_SEARCHED'

// Models
export interface Library extends _Library {}
export interface NodeSchema extends _NodeSchema {}
export interface PortSchema extends _PortSchema {}
export interface BlueprintSchema extends _BlueprintSchema {}

export interface LibraryTreeNode {
  key: string
  title: string | React.ReactNode
  children: Array<LibraryTreeNode>
}

// Actions
interface LoadLibraryAction {
  type: typeof LIBRARY_LOADED
  library: Library
}

export interface DragNodeSchemaAction {
  type: typeof LIBRARY_NODE_DRAGGED
  node: NodeSchema
}

interface SearchLibraryAction {
  type: typeof LIBRARY_SEARCHED
  searchTerms: string
}

export type LibraryAction =
  LoadLibraryAction
  | DragNodeSchemaAction
  | SearchLibraryAction

// States
export interface LibraryState {
  nodes: Array<NodeSchema>
  searchTerms: string
}
