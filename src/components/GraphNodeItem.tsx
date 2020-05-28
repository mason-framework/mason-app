import React from 'react'
import { Drag } from '@vx/drag'
import {
  GraphConnection,
  GraphHotspot,
  COLORS_DEFAULT_STROKE,
  COLORS_DRAG_STROKE,
  COLORS_SELECTED_STROKE,
  COLORS_NODE_FILL,
  COLORS_TEXT_FILL,
} from 'store/graph/types'

import GraphHotspotItem from 'components/GraphHotspotItem'

const FLIP_PLACEMENT: Record<string, string> = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
}

interface Props {
  dragHeight?: number
  dragWidth?: number
  height: number
  hotspots: Array<GraphHotspot>
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
  onConnectionStart(connection: GraphConnection): void
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
      let stroke = COLORS_DEFAULT_STROKE
      let nodeX = x
      let nodeY = y
      if (isDragging) {
        stroke = COLORS_DRAG_STROKE
        nodeX += dx
        nodeY += dy
      } else if (selected) {
        stroke = COLORS_SELECTED_STROKE
      }
      return (
        <>
          <g transform={`translate(${nodeX}, ${nodeY})`}>
            <rect
              rx={6}
              width={width}
              height={height}
              fill={COLORS_NODE_FILL}
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
              fill={COLORS_TEXT_FILL}
              fontSize={12}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {label}
            </text>
          </g>

          {hotspots.map((hotspot) => {
            const isSource = hotspot.offsetX !== 1
            const createConnection = (): GraphConnection => ({
              source: isSource ? hotspot.uid : '',
              target: isSource ? '' : hotspot.uid,
              sourcePlacement: isSource ? hotspot.placement : FLIP_PLACEMENT[hotspot.placement],
              sourcePos: {
                x: nodeX + (isSource ? 0 : hotspot.offsetX),
                y: nodeY + (isSource ? 0 : hotspot.offsetY),
                offsetX: isSource ? hotspot.offsetX : 0,
                offsetY: isSource ? hotspot.offsetY : 0,
              },
              targetPos: {
                x: nodeX + (isSource ? hotspot.offsetX : 0),
                y: nodeY + (isSource ? hotspot.offsetY : 0),
                offsetX: isSource ? 0 : hotspot.offsetX,
                offsetY: isSource ? 0 : hotspot.offsetY,
              },
              targetPlacement: isSource ? FLIP_PLACEMENT[hotspot.placement] : hotspot.placement,
            })
            return (
              <GraphHotspotItem
                fill={hotspot.fill || ''}
                isConnecting={isConnecting}
                key={hotspot.uid}
                onConnectionEnd={onConnectionEnd}
                onConnectionStart={() => onConnectionStart(createConnection())}
                onConnectionMove={onConnectionMove}
                stroke={stroke}
                title={hotspot.title || ''}
                transform={`translate(${nodeX}, ${nodeY})`}
                x={hotspot.offsetX}
                y={hotspot.offsetY}
              />
            )
          })}
        </>
      )
    }}
  </Drag>
)

export default GraphNodeItem
