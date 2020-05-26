import React from 'react'

import { AutoSizer } from 'react-virtualized'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { useDrop } from 'react-dnd'

import Graph from 'components/Graph'
import { LIBRARY_NODE_DRAGGED, LibraryNodeDraggedAction } from 'store/tree/types'
import {
  dropLibraryNode,
  moveGraphNode,
  selectGraphNode,
  startConnection,
  moveConnection,
  stopConnection,
} from 'store/graph/actions'
import {
  getConnections,
  getIsConnecting,
  getNodes,
  getSelectedNodeId,
} from 'store/graph/selectors'
import { GraphNode, GraphConnection } from 'store/graph/types'
import { ReduxState } from 'store/types'

interface Props {
  isConnecting: boolean
  nodes: Array<GraphNode>
  connections: Array<GraphConnection>
  selectedNodeId: string
}

interface Actions {
  onConnectionStart: typeof startConnection
  onConnectionMove: typeof moveConnection
  onConnectionEnd: typeof stopConnection
  onLibraryNodeDrop: typeof dropLibraryNode
  onNodeDrag: typeof moveGraphNode
  onNodeDragStart: typeof selectGraphNode
}

const GraphView = ({
  connections,
  isConnecting,
  nodes,
  onConnectionEnd,
  onConnectionMove,
  onConnectionStart,
  onLibraryNodeDrop,
  onNodeDrag,
  onNodeDragStart,
  selectedNodeId,
}: Props & Actions) => {
  const dropInfo = useDrop({
    accept: LIBRARY_NODE_DRAGGED,
    drop: ({ nodeType }: LibraryNodeDraggedAction, monitor: any) => {
      const { x, y } = monitor.getClientOffset()
      const graphElement = document.getElementById('graph')
      const { top, left } = (
        graphElement
          ? graphElement.getBoundingClientRect()
          : { top: 0, left: 0 }
      )
      onLibraryNodeDrop(nodeType, x - left, y - top)
    },
  })
  return (
    <AutoSizer>
      {({ width, height }) => (
        <div
          id="graph"
          style={{
            border: '1px solid #0c0c0c',
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
            onNodeDrag={onNodeDrag}
            onNodeDragStart={onNodeDragStart}
            selectedNodeId={selectedNodeId}
            width={10000}
          />
        </div>
      )}
    </AutoSizer>
  )
}

const selector = createStructuredSelector<ReduxState, Props>({
  connections: getConnections,
  isConnecting: getIsConnecting,
  nodes: getNodes,
  selectedNodeId: getSelectedNodeId,
})

const actions = {
  onConnectionStart: startConnection,
  onConnectionEnd: stopConnection,
  onConnectionMove: moveConnection,
  onLibraryNodeDrop: dropLibraryNode,
  onNodeDrag: moveGraphNode,
  onNodeDragStart: selectGraphNode,
}

export default connect(selector, actions)(GraphView);
