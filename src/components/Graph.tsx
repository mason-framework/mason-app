import React from 'react'

import { localPoint } from '@vx/event'
import { Zoom } from '@vx/zoom'

import { COLOR_BG } from 'store/graph/colors'
import { Node, Connection, Hotspot } from 'store/blueprint/types'
import GraphNodeItem from 'components/GraphNodeItem'
import GraphConnectionItem from 'components/GraphConnectionItem'

interface Props {
  connections: Array<Connection>
  isConnecting: boolean
  nodes: Array<Node>
  selection: Array<string>
}

interface Dimensions {
  height: number
  width: number
}

interface Actions {
  onClearSelection(): void
  onConnectionEnd(): void
  onConnectionMove(dx: number, dy: number): void
  onConnectionStart(hotspot: Hotspot, x: number, y: number): void
  onNodeDrag(uid: string, dx: number, dy: number): void
  onNodeDragEnd(uid: string): void
  onNodeDragStart(uid: string): void
  onSelect(uid: string): void
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
  onNodeDragEnd,
  onSelect,
  selection,
}: Props & Actions) => (
  <>
    {connections.map((conn) => {
      const uid = `${conn.sourceNodeId}.${conn.sourceName}--${conn.targetNodeId}.${conn.targetName}`
      return (
        <GraphConnectionItem
          key={uid}
          uid={uid}
          onSelect={onSelect}
          sourcePos={conn.sourcePos}
          targetPos={conn.targetPos}
          sourcePlacement={conn.sourcePlacement}
          targetPlacement={conn.targetPlacement}
          selected={selection.includes(uid)}
        />
      )
    })}
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
        onDragEnd={onNodeDragEnd}
        selected={selection.includes(node.uid)}
        label={node.label}
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
  onClearSelection,
  onNodeDrag,
  onNodeDragStart,
  onNodeDragEnd,
  onSelect,
  selection,
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
          fill={COLOR_BG}
          onWheel={handleWheel}
          onMouseDown={dragStart}
          onMouseMove={dragMove}
          onMouseUp={() => {
            onClearSelection()
            dragEnd()
          }}
          onMouseLeave={() => {
            if (!isDragging) return
            onClearSelection()
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
            onClearSelection={onClearSelection}
            onConnectionEnd={onConnectionEnd}
            onConnectionStart={onConnectionStart}
            onConnectionMove={onConnectionMove}
            onNodeDrag={onNodeDrag}
            onNodeDragStart={onNodeDragStart}
            onNodeDragEnd={onNodeDragEnd}
            onSelect={onSelect}
            selection={selection}
          />
        </g>
      </svg>
    )}
  </Zoom>
)

export default Graph
