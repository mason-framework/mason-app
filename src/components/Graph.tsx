import React from 'react'

import { localPoint } from '@vx/event'
import { Zoom } from '@vx/zoom'

import { GraphNode, GraphConnection, COLORS_BG } from 'store/graph/types'
import GraphNodeItem from 'components/GraphNodeItem'
import GraphConnectionItem from 'components/GraphConnectionItem'

interface Props {
  connections: Array<GraphConnection>
  isConnecting: boolean
  nodes: Array<GraphNode>
  selectedNodeId: string
}

interface Dimensions {
  height: number
  width: number
}

interface Actions {
  onConnectionEnd: any
  onConnectionMove: any
  onConnectionStart: any
  onNodeDrag: any
  onNodeDragStart: any
}

const GraphLayout = ({
  connections,
  isConnecting,
  nodes,
  onConnectionEnd,
  onConnectionMove,
  onConnectionStart,
  onNodeDrag,
  onNodeDragStart,
  selectedNodeId,
}: Props & Actions) => (
  <>
    {connections.map(({
      source,
      sourceOffsetX,
      sourceOffsetY,
      sourceX,
      sourceY,
      target,
      targetOffsetX,
      targetOffsetY,
      targetX,
      targetY,
    }) => (
      <GraphConnectionItem
        key={`${source}-${target}`}
        sourceOffsetX={sourceOffsetX || 0}
        sourceOffsetY={sourceOffsetY || 0}
        sourceX={sourceX || 0}
        sourceY={sourceY || 0}
        targetOffsetX={targetOffsetX || 0}
        targetOffsetY={targetOffsetY || 0}
        targetX={targetX || 0}
        targetY={targetY || 0}
      />
    ))}
    {nodes.map((node) => (
      <GraphNodeItem
        height={node.height}
        hotspots={node.hotspots}
        isConnecting={isConnecting}
        key={node.uid}
        onConnectionEnd={onConnectionEnd}
        onConnectionMove={onConnectionMove}
        onConnectionStart={onConnectionStart}
        onDrag={onNodeDrag}
        onDragStart={onNodeDragStart}
        selected={node.uid === selectedNodeId}
        title={node.title}
        uid={node.uid}
        width={node.width}
        x={node.x}
        y={node.y}
      />
    ))}
  </>
)

const Graph = ({
  connections,
  height,
  nodes,
  isConnecting,
  onConnectionEnd,
  onConnectionStart,
  onConnectionMove,
  onNodeDrag,
  onNodeDragStart,
  selectedNodeId,
  width,
}: Dimensions & Props & Actions) => (
  <Zoom
    height={height}
    scaleXMax={4}
    scaleXMin={0.1}
    scaleYMax={4}
    scaleYMin={0.1}
    width={width}
  >
    {({
      dragEnd,
      dragMove,
      dragStart,
      handleWheel,
      isDragging,
      scale,
      toString,
    }) => (
      <svg width={width} height={height} style={{ cursor: isDragging ? 'grabbing' : '' }}>
        <rect
          width={width}
          height={height}
          fill={COLORS_BG}
          onWheel={handleWheel}
          onMouseDown={dragStart}
          onMouseMove={dragMove}
          onMouseUp={dragEnd}
          onMouseLeave={() => {
            if (!isDragging) return
            dragEnd()
          }}
          onDoubleClick={(event) => {
            const point: any = localPoint(event)
            scale({ scaleX: 1.1, scaleY: 1.1, point })
          }}
        />
        <g transform={toString()}>
          <GraphLayout
            connections={connections}
            isConnecting={isConnecting}
            nodes={nodes}
            onConnectionEnd={onConnectionEnd}
            onConnectionStart={onConnectionStart}
            onConnectionMove={onConnectionMove}
            onNodeDrag={onNodeDrag}
            onNodeDragStart={onNodeDragStart}
            selectedNodeId={selectedNodeId}
          />
        </g>
      </svg>
    )}
  </Zoom>
)

export default Graph
