import { Connection, Hotspot, PositionDelta } from 'store/blueprint/types'
import { NodeSchema } from 'store/library/types'

export const CONNECTOR_FINISHED = '@@graph/CONNECTOR_FINISHED'
export const CONNECTOR_MOVED = '@@graph/CONNECTOR_MOVED'
export const CONNECTOR_SUGGESTIONS_SHOWED = '@@graph/CONNECTOR_SUGGESTIONS_SHOWED'
export const CONNECTOR_STARTED = '@@graph/CONNECTOR_STARTED'
export const CONNECTOR_STOPPED = '@@graph/CONNECTOR_STOPPED'

export const NODE_DELTA_CLEARED = '@@graph/NODE_DELTA_CLEARED'
export const NODE_SCHEMA_DROPPED = '@@graph/NODE_SCHEMA_DROPPED'
export const NODE_MOVE_FINISHED = '@@graph/NODE_MOVE_FINISHED'
export const NODE_MOVED = '@@graph/NODE_MOVED'

export const SUGGESTIONS_CLEARED = '@@graph/SUGGESTIONS_CLEARED'
export const SUGGESTIONS_SEARCHED = '@@graph/SUGGESTIONS_SEARCHED'
export const SUGGESTION_PICKED = '@@graph/SUGGESTION_PICKED'
export const SUGGESTIONS_SHOWN = '@@graph/SUGGESTIONS_SHOWN'

export interface Position {
  x: number
  y: number
}

export interface ConnectorSuggestion {
  schema: NodeSchema
  name: string
}

// Actions
export interface DropNodeSchemaAction {
  type: typeof NODE_SCHEMA_DROPPED
  schema: NodeSchema
  x: number
  y: number
}

interface ClearNodeDeltaAction {
  type: typeof NODE_DELTA_CLEARED
  uid: string
}

interface MoveConnectorAction {
  type: typeof CONNECTOR_MOVED
  dx: number
  dy: number
}

interface MoveConnectorAction {
  type: typeof CONNECTOR_MOVED
  dx: number
  dy: number
}

export interface MoveNodeAction {
  type: typeof NODE_MOVED
  uid: string
  dx: number
  dy: number
}

interface FinishConnectorAction {
  type: typeof CONNECTOR_FINISHED
}

export interface FinishNodeMoveAction {
  type: typeof NODE_MOVE_FINISHED
  uid: string
}

interface StartConnectorAction {
  type: typeof CONNECTOR_STARTED
  hotspot: Hotspot
  x: number
  y: number
}

interface ClearSuggestionsAction {
  type: typeof SUGGESTIONS_CLEARED
}

export interface PickSuggestionAction {
  type: typeof SUGGESTION_PICKED
  suggestion: ConnectorSuggestion
}

interface SearchSuggestionsAction {
  type: typeof SUGGESTIONS_SEARCHED
  terms: string
}

interface ShowSuggestionsAction {
  type: typeof SUGGESTIONS_SHOWN
  suggestions: Array<ConnectorSuggestion>
  x: number
  y: number
}

export interface StopConnectorAction {
  type: typeof CONNECTOR_STOPPED
  x: number
  y: number
}

export type GraphAction =
  ClearNodeDeltaAction |
  DropNodeSchemaAction |
  FinishConnectorAction |
  FinishNodeMoveAction |
  MoveConnectorAction |
  MoveNodeAction |
  ClearSuggestionsAction |
  PickSuggestionAction |
  SearchSuggestionsAction |
  ShowSuggestionsAction |
  StartConnectorAction |
  StopConnectorAction


// State
export interface GraphState {
  connector?: Connection
  nodeDeltas: Record<string, PositionDelta>
  suggestions?: Array<ConnectorSuggestion>
  suggestionsSearch: string
  suggestionsPosition: Position
}

export const createGraphState = (options: any = {}): GraphState => ({
  connector: undefined,
  nodeDeltas: {},
  suggestions: undefined,
  suggestionsPosition: { x: 0, y: 0 },
  suggestionsSearch: '',
  ...options,
})
