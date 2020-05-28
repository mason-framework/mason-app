import React from 'react'

import { AutoSizer } from 'react-virtualized'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { useDrop } from 'react-dnd'

import Graph from 'components/Graph'
import {
  LIBRARY_NODE_DRAGGED,
  DragNodeSchemaAction,
  NodeSchema,
} from 'store/library/types'
import {
  dropNodeSchema,
  clearSelection,
  finishMoveNode,
  moveNode,
  addSelection,
  startConnector,
  moveConnector,
  stopConnector,
} from 'store/graph/actions'
import {
  getMappedConnections,
  getIsConnecting,
  getNodes,
  getSelection,
} from 'store/graph/selectors'
import { GraphNode, GraphConnection } from 'store/graph/types'
import { ReduxState } from 'store/types'

interface Props {
  isConnecting: boolean
  nodes: Array<GraphNode>
  connections: Array<GraphConnection>
  selection: Array<string>
}

interface Actions {
  onClearSelection(): void
  onConnectionEnd(): void
  onConnectionMove(dx: number, dy: number): void
  onConnectionStart(connection: GraphConnection): void
  onDropNodeSchema(nodeSchema: NodeSchema, x: number, y: number): void
  onNodeDrag(uid: string, dx: number, dy: number): void
  onNodeDragEnd(uid: string): void
  onNodeDragStart(uid: string): void
  onSelect(uid: string): void
}

const GraphView = ({
  connections,
  isConnecting,
  nodes,
  onConnectionEnd,
  onConnectionMove,
  onConnectionStart,
  onClearSelection,
  onDropNodeSchema,
  onNodeDrag,
  onNodeDragStart,
  onNodeDragEnd,
  onSelect,
  selection,
}: Props & Actions) => {
  const dropInfo = useDrop({
    accept: LIBRARY_NODE_DRAGGED,
    drop: ({ node }: DragNodeSchemaAction, monitor: any) => {
      const { x, y } = monitor.getClientOffset()
      const graphElement = document.getElementById('graph')
      const { top, left } = (
        graphElement
          ? graphElement.getBoundingClientRect()
          : { top: 0, left: 0 }
      )
      onDropNodeSchema(node, x - left, y - top)
    },
  })
  return (
    <AutoSizer>
      {({ width, height }) => (
        <div
          id="graph"
          style={{
            borderLeft: '1px solid #0c0c0c',
            borderRight: '1px solid #0c0c0c',
            height,
            overflow: 'hidden',
            width,
          }}
          ref={dropInfo[1]}
        >
          <Graph
            connections={connections}
            height={10000}
            isConnecting={isConnecting}
            nodes={nodes}
            onConnectionEnd={onConnectionEnd}
            onConnectionMove={onConnectionMove}
            onConnectionStart={onConnectionStart}
            onClearSelection={onClearSelection}
            onNodeDrag={onNodeDrag}
            onNodeDragStart={onNodeDragStart}
            onNodeDragEnd={onNodeDragEnd}
            onSelect={onSelect}
            selection={selection}
            width={10000}
          />
        </div>
      )}
    </AutoSizer>
  )
}

const selector = createStructuredSelector<ReduxState, Props>({
  connections: getMappedConnections,
  isConnecting: getIsConnecting,
  nodes: getNodes,
  selection: getSelection,
})

const actions = {
  onConnectionStart: startConnector,
  onConnectionEnd: stopConnector,
  onConnectionMove: moveConnector,
  onClearSelection: clearSelection,
  onDropNodeSchema: dropNodeSchema,
  onNodeDrag: moveNode,
  onNodeDragStart: addSelection,
  onNodeDragEnd: finishMoveNode,
  onSelect: addSelection,
}

export default connect(selector, actions)(GraphView);
