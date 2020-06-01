import React from 'react'

import { AutoSizer } from 'react-virtualized'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { HotKeys } from 'react-hotkeys'

import ConnectorSuggestionMenu from 'components/ConnectorSuggestionMenu'
import Graph from 'components/Graph'

import { NodeSchema } from 'store/library/types'

import {
  clearSuggestions,
  dropNodeSchema,
  finishMoveNode,
  moveConnector,
  moveNode,
  pickSuggestion,
  searchSuggestions,
  startConnector,
  stopConnector,
} from 'store/graph/actions'

import { ConnectorSuggestion, Position } from 'store/graph/types'

import {
  addSelection,
  clearSelection,
  copySelection,
  cutSelection,
  pasteSelection,
  deleteSelection,
} from 'store/selection/actions'

import {
  getConnections,
  getIsConnecting,
  getNodes,
  getSuggestions,
  getSuggestionsPosition,
  getSuggestionsSearch,
} from 'store/graph/selectors'

import {
  getSelection,
} from 'store/selection/selectors'

import { Node, Connection, Hotspot } from 'store/blueprint/types'
import { ReduxState } from 'store/types'

interface Props {
  connections: Array<Connection>
  isConnecting: boolean
  nodes: Array<Node>
  selection: Array<string>
  suggestions?: Array<ConnectorSuggestion>
  suggestionsPosition: Position
  suggestionsSearch: string
}

interface Actions {
  onClearSelection(): void
  onClearSuggestions(): void
  onConnectionEnd(x: number, y: number): void
  onConnectionMove(dx: number, dy: number): void
  onConnectionStart(hotspot: Hotspot, x: number, y: number): void
  onCopy(): void
  onCut(): void
  onDelete(): void
  onDropNodeSchema(schema: NodeSchema, x: number, y: number): void
  onNodeDrag(uid: string, dx: number, dy: number): void
  onNodeDragEnd(uid: string): void
  onNodeDragStart(uid: string): void
  onPaste(): void
  onSelect(uid: string): void
  onSuggestionPicked(suggestion: ConnectorSuggestion): void
  onSuggestionsSearch(terms: string): void
}

const GraphView = ({
  connections,
  isConnecting,
  nodes,
  onClearSelection,
  onClearSuggestions,
  onConnectionEnd,
  onConnectionMove,
  onConnectionStart,
  onCopy,
  onCut,
  onDelete,
  onDropNodeSchema,
  onNodeDrag,
  onNodeDragEnd,
  onNodeDragStart,
  onPaste,
  onSelect,
  onSuggestionPicked,
  onSuggestionsSearch,
  selection,
  suggestions,
  suggestionsPosition,
  suggestionsSearch,
}: Props & Actions) => (
  <>
    <HotKeys
      keyMap={{
        DELETE_NODE: ['del', 'backspace'],
        COPY: ['cmd+c'],
        CUT: ['cmd+x'],
        PASTE: ['cmd+v'],
      }}
      handlers={{
        DELETE_NODE: onDelete,
        COPY: onCopy,
        CUT: onCut,
        PASTE: onPaste,
      }}
    >
      <AutoSizer>
        {({ width, height }) => (
          <Graph
            connections={connections}
            height={10000}
            isConnecting={isConnecting}
            nodes={nodes}
            onConnectionEnd={onConnectionEnd}
            onConnectionMove={onConnectionMove}
            onConnectionStart={onConnectionStart}
            onClearSelection={onClearSelection}
            onDropNodeSchema={onDropNodeSchema}
            onNodeDrag={onNodeDrag}
            onNodeDragStart={onNodeDragStart}
            onNodeDragEnd={onNodeDragEnd}
            onSelect={onSelect}
            selection={selection}
            width={10000}
          />
        )}
      </AutoSizer>
    </HotKeys>
    {(
      !!suggestions
      && (
        <ConnectorSuggestionMenu
          onClose={onClearSuggestions}
          onSuggestionPicked={onSuggestionPicked}
          onSearch={onSuggestionsSearch}
          suggestions={suggestions}
          searchTerms={suggestionsSearch}
          x={suggestionsPosition.x}
          y={suggestionsPosition.y}
        />
      )
    )}
  </>
)

const selector = createStructuredSelector<ReduxState, Props>({
  connections: getConnections,
  isConnecting: getIsConnecting,
  nodes: getNodes,
  selection: getSelection,
  suggestions: getSuggestions,
  suggestionsPosition: getSuggestionsPosition,
  suggestionsSearch: getSuggestionsSearch,
})

const actions = {
  onClearSelection: clearSelection,
  onClearSuggestions: clearSuggestions,
  onConnectionEnd: stopConnector,
  onConnectionMove: moveConnector,
  onConnectionStart: startConnector,
  onCopy: copySelection,
  onCut: cutSelection,
  onDelete: deleteSelection,
  onDropNodeSchema: dropNodeSchema,
  onNodeDrag: moveNode,
  onNodeDragEnd: finishMoveNode,
  onNodeDragStart: addSelection,
  onPaste: pasteSelection,
  onSelect: addSelection,
  onSuggestionPicked: pickSuggestion,
  onSuggestionsSearch: searchSuggestions,
}

export default connect(selector, actions)(GraphView);
