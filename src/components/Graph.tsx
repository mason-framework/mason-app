import React from 'react'
import { useDrop } from 'react-dnd'
import { localPoint } from '@vx/event'
import { Zoom } from '@vx/zoom'

import { COLOR_BG } from 'store/graph/colors'
import { Node, Connection, Hotspot } from 'store/blueprint/types'
import GraphNodeItem from 'components/GraphNodeItem'
import GraphConnectionItem from 'components/GraphConnectionItem'

import {
  LIBRARY_NODE_DRAGGED,
  DragNodeSchemaAction,
  NodeSchema,
} from 'store/library/types'

interface Point {
  x: number
  y: number
}

interface Props {
  activeNodeIds: Array<string>
  connections: Array<Connection>
  isConnecting: boolean
  nodes: Array<Node>
  selection: Array<string>
}

interface LayoutProps {
  scaleX: number
  scaleY: number
}

interface Dimensions {
  height: number
  width: number
}

interface Actions {
  onClearSelection(): void
  onConnectionEnd(x: number, y: number): void
  onConnectionMove(dx: number, dy: number): void
  onConnectionStart(hotspot: Hotspot, x: number, y: number): void
  onNodeDrag(uid: string, dx: number, dy: number): void
  onNodeDragEnd(uid: string): void
  onNodeDragStart(uid: string): void
  onSelect(uid: string): void
}

interface ViewActions {
  onDropNodeSchema(schema: NodeSchema, x: number, y: number): void
}

const GraphLayout = ({
  activeNodeIds,
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
  scaleX,
  scaleY,
}: LayoutProps & Props & Actions) => (
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
        selected={selection.includes(node.uid) || activeNodeIds.includes(node.uid)}
        label={node.label}
        uid={node.uid}
        width={node.width}
        x={node.x}
        y={node.y}
        scaleX={scaleX}
        scaleY={scaleY}
      />
    ))}
  </>
)

const GraphInner = ({
  activeNodeIds,
  connections,
  height,
  nodes,
  isConnecting,
  onConnectionEnd,
  onConnectionStart,
  onConnectionMove,
  onClearSelection,
  onDropNodeSchema,
  onNodeDrag,
  onNodeDragStart,
  onNodeDragEnd,
  onSelect,
  selection,
  width,
  zoom,
}: Dimensions & Props & Actions & ViewActions & { zoom: any }) => {
  const dropInfo = useDrop({
    accept: LIBRARY_NODE_DRAGGED,
    drop: ({ node }: DragNodeSchemaAction, monitor: any) => {
      const { x: clientX, y: clientY } = monitor.getClientOffset()
      const graphElement = document.getElementById('graph')
      const { top, left } = (
        graphElement
          ? graphElement.getBoundingClientRect()
          : { top: 0, left: 0 }
      )
      const { x, y } = zoom.applyInverseToPoint({ x: clientX - left, y: clientY - top })
      onDropNodeSchema(node, x, y)
    },
  })

  return (
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
      <svg width={width} height={height} style={{ cursor: zoom.isDragging ? 'grabbing' : '' }}>
        <rect
          width={width}
          height={height}
          fill={COLOR_BG}
          onWheel={zoom.handleWheel}
          onMouseDown={zoom.dragStart}
          onMouseMove={zoom.dragMove}
          onMouseUp={() => {
            onClearSelection()
            zoom.dragEnd()
          }}
          onMouseLeave={() => {
            if (!zoom.isDragging) return
            onClearSelection()
            zoom.dragEnd()
          }}
          onDoubleClick={(event) => {
            const point: any = localPoint(event)
            zoom.scale({ scaleX: 1.1, scaleY: 1.1, point })
          }}
        />
        <g transform={zoom.toString()}>
          <GraphLayout
            activeNodeIds={activeNodeIds}
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
            scaleX={zoom.transformMatrix.scaleX}
            scaleY={zoom.transformMatrix.scaleY}
          />
        </g>
      </svg>
    </div>
  )
}

const Graph = (props: Dimensions & Props & Actions & ViewActions) => (
  <Zoom
    height={props.height}
    scaleXMax={4}
    scaleXMin={0.1}
    scaleYMax={4}
    scaleYMin={0.1}
    width={props.width}
  >
    {(zoom) => <GraphInner zoom={zoom} {...props } />}
  </Zoom>
)

export default Graph
