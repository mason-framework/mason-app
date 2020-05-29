import React from 'react'
import { Drag } from '@vx/drag'
import { Hotspot } from 'store/blueprint/types'
import {
  COLOR_DEFAULT_STROKE,
  COLOR_DRAG_STROKE,
  COLOR_SELECTED_STROKE,
  COLOR_NODE_FILL,
  COLOR_TEXT_FILL,
} from 'store/graph/colors'

import GraphHotspotItem from 'components/GraphHotspotItem'

interface Props {
  dragHeight?: number
  dragWidth?: number
  height: number
  hotspots: Array<Hotspot>
  isConnecting: boolean
  selected: boolean
  uid: string
  width: number
  x: number
  y: number
  label: string
}

interface Actions {
  onConnectionEnd(): void
  onConnectionMove(dx: number, dy: number): void
  onConnectionStart(hotspot: Hotspot, x: number, y: number): void
  onDrag(uid: string, dx: number, dy: number): void
  onDragEnd(uid: string): void
  onDragStart(uid: string): void
}

const GraphNodeItem = ({
  dragHeight = 10000,
  dragWidth = 10000,
  height,
  hotspots,
  isConnecting,
  onConnectionEnd,
  onConnectionMove,
  onConnectionStart,
  onDrag,
  onDragStart,
  onDragEnd,
  selected,
  label,
  uid,
  width,
  x,
  y,
}: Props & Actions) => (
  <Drag
    width={dragWidth}
    height={dragHeight}
    onDragStart={() => onDragStart(uid)}
    onDragMove={({ dx, dy }) => onDrag(uid, dx, dy)}
    onDragEnd={() => onDragEnd(uid)}
    resetOnStart
  >
    {({
      dragStart,
      dragEnd,
      dragMove,
      isDragging,
      dx,
      dy,
    }) => {
      let stroke = COLOR_DEFAULT_STROKE
      let nodeX = x
      let nodeY = y
      if (isDragging) {
        stroke = COLOR_DRAG_STROKE
        nodeX += dx
        nodeY += dy
      } else if (selected) {
        stroke = COLOR_SELECTED_STROKE
      }
      return (
        <>
          <g transform={`translate(${nodeX}, ${nodeY})`}>
            <rect
              rx={6}
              width={width}
              height={height}
              fill={COLOR_NODE_FILL}
              stroke={stroke}
              style={{ pointerEvents: isConnecting ? 'none' : 'initial' }}
              strokeWidth={2}
              onMouseMove={dragMove}
              onMouseUp={dragEnd}
              onMouseDown={dragStart}
              onTouchStart={dragStart}
              onTouchMove={dragMove}
              onTouchEnd={dragEnd}
            />
            <text
              x={20}
              y={5 + (height / 2)}
              fill={COLOR_TEXT_FILL}
              fontSize={12}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {label}
            </text>
          </g>

          {hotspots.map((hotspot) => (
            <GraphHotspotItem
              fill={hotspot.fill || ''}
              isConnecting={isConnecting}
              key={`${hotspot.nodeId}.${hotspot.name}`}
              onConnectionEnd={onConnectionEnd}
              onConnectionStart={() => onConnectionStart(hotspot, nodeX, nodeY)}
              onConnectionMove={onConnectionMove}
              stroke={stroke}
              title={hotspot.title || ''}
              transform={`translate(${nodeX}, ${nodeY})`}
              x={hotspot.offsetX}
              y={hotspot.offsetY}
            />
          ))}
        </>
      )
    }}
  </Drag>
)

export default GraphNodeItem
