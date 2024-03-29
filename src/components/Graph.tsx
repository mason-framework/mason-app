import React from 'react'
import { useDrop } from 'react-dnd'
import { localPoint } from '@vx/event'
import { LinearGradient } from '@vx/gradient'
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

interface Props {
  activeNodeIds: Array<string>
  connectedHotpotIds: Record<string, boolean>
  connections: Array<Connection>
  isConnecting: boolean
  nodes: Array<Node>
  selection: Array<string>
}

interface LayoutProps {
  isDragging: boolean
  scaleX: number
  scaleY: number
}

interface Dimensions {
  height: number
  width: number
  size: number
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
  connectedHotpotIds,
  isDragging,
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
          sourceColor={conn.sourceColor}
          targetColor={conn.targetColor}
          sourcePlacement={conn.sourcePlacement}
          targetPlacement={conn.targetPlacement}
          selected={selection.includes(uid)}
        />
      )
    })}
    {nodes.map((node) => (
      <GraphNodeItem
        height={node.height}
        connectedHotpotIds={connectedHotpotIds}
        hotspots={node.hotspots}
        disablePointer={isConnecting || isDragging}
        key={node.uid}
        onConnectionEnd={onConnectionEnd}
        onConnectionMove={onConnectionMove}
        onConnectionStart={onConnectionStart}
        onDrag={onNodeDrag}
        onDragStart={onNodeDragStart}
        onDragEnd={onNodeDragEnd}
        selected={selection.includes(node.uid) || activeNodeIds.includes(node.uid)}
        label={node.label}
        shape={node.schema.shape}
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
  connectedHotpotIds,
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
  size,
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
      <svg
        width={size}
        height={size}
        style={{ cursor: zoom.isDragging ? 'grabbing' : '' }}
      >
        <LinearGradient id="node-bg" from="#1a1a1a" to="#0f0f0f" />
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
            connectedHotpotIds={connectedHotpotIds}
            connections={connections}
            isConnecting={isConnecting}
            isDragging={zoom.isDragging}
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

const Graph = ({
  height,
  width,
  size,
  ...props
}: Dimensions & Props & Actions & ViewActions) => (
  <Zoom
    height={height}
    scaleXMax={4}
    scaleXMin={0.1}
    scaleYMax={4}
    scaleYMin={0.1}
    width={width}
    transformMatrix={{
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      translateX: -size / 2,
      translateY: -size / 2,
    }}
  >
    {(zoom) => <GraphInner zoom={zoom} height={height} width={width} size={size} {...props} />}
  </Zoom>
)

export default Graph
