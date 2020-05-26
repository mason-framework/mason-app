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
  title: string
}

interface Actions {
  onConnectionStart(connection: GraphConnection): any
  onConnectionMove(dx: number, dy: number): any
  onConnectionEnd(): any
  onDragStart(uid: string): any
  onDrag(uid: string, dx: number, dy: number): any
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
  selected,
  title,
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
      if (isDragging) {
        stroke = COLORS_DRAG_STROKE
      } else if (selected) {
        stroke = COLORS_SELECTED_STROKE
      }
      return (
        <>
          <g transform={`translate(${x + dx}, ${y + dy})`}>
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
              {title}
            </text>
          </g>

          {hotspots.map((hotspot) => {
            const isSource = hotspot.direction === 'output'
            const createConnection = (): GraphConnection => ({
              source: isSource ? hotspot.uid : '',
              sourceX: x + dx + (isSource ? 0 : hotspot.offsetX),
              sourceY: y + dy + (isSource ? 0 : hotspot.offsetY),
              sourceOffsetX: isSource ? hotspot.offsetX : 0,
              sourceOffsetY: isSource ? hotspot.offsetY : 0,
              target: isSource ? '' : hotspot.uid,
              targetX: x + dx + (isSource ? hotspot.offsetX : 0),
              targetY: y + dy + (isSource ? hotspot.offsetY : 0),
              targetOffsetX: isSource ? 0 : hotspot.offsetX,
              targetOffsetY: isSource ? 0 : hotspot.offsetY,
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
                transform={`translate(${x + dx}, ${y + dy})`}
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
