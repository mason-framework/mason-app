import React from 'react'
import { Drag } from '@vx/drag'
import { Hotspot } from 'store/blueprint/types'
import {
  COLOR_DEFAULT_STROKE,
  COLOR_DRAG_STROKE,
  COLOR_SELECTED_STROKE,
  COLOR_TEXT,
} from 'store/graph/colors'

import GraphHotspotItem from 'components/GraphHotspotItem'

interface Props {
  connectedHotpotIds: Record<string, boolean>
  dragHeight?: number
  dragWidth?: number
  height: number
  hotspots: Array<Hotspot>
  disablePointer: boolean
  label: string
  selected: boolean
  uid: string
  width: number
  x: number
  y: number
  scaleX: number
  scaleY: number
  shape?: string
}

interface Actions {
  onConnectionEnd(x: number, y: number): void
  onConnectionMove(dx: number, dy: number): void
  onConnectionStart(hotspot: Hotspot, x: number, y: number): void
  onDrag(uid: string, dx: number, dy: number): void
  onDragEnd(uid: string): void
  onDragStart(uid: string): void
}

const GraphNodeItem = ({
  connectedHotpotIds,
  dragHeight = 10000,
  dragWidth = 10000,
  height,
  hotspots,
  disablePointer,
  label,
  onConnectionEnd,
  onConnectionMove,
  onConnectionStart,
  onDrag,
  onDragEnd,
  onDragStart,
  selected,
  uid,
  width,
  x,
  y,
  shape = undefined,
  scaleX,
  scaleY,
}: Props & Actions) => (
  <Drag
    width={dragWidth}
    height={dragHeight}
    onDragStart={() => onDragStart(uid)}
    onDragMove={({ dx, dy }) => onDrag(uid, dx / scaleX, dy / scaleY)}
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
      const defaultStroke = selected ? COLOR_SELECTED_STROKE : COLOR_DEFAULT_STROKE
      const stroke = isDragging ? COLOR_DRAG_STROKE : defaultStroke
      const {
        x: nodeX,
        y: nodeY,
      } = isDragging ? { x: x + (dx / scaleX), y: y + (dy / scaleY) } : { x, y }

      let geom: React.ReactNode
      if (shape === 'round') {
        geom = (
          <>
            <rect
              rx={25}
              width={width}
              height={height}
              fill="url(#node-bg)"
              stroke={stroke}
              style={{ pointerEvents: disablePointer ? 'none' : 'initial' }}
              strokeWidth={1.5}
              onMouseMove={dragMove}
              onMouseUp={dragEnd}
              onMouseDown={dragStart}
              onTouchStart={dragStart}
              onTouchMove={dragMove}
              onTouchEnd={dragEnd}
              opacity={0.75}
            />
            <text
              x={width / 2}
              y={height / 2 + 3}
              fill={COLOR_TEXT}
              textAnchor="middle"
              fontSize={12}
              fontWeight="bold"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {label}
            </text>
          </>
        )
      } else {
        geom = (
          <>
            <rect
              rx={6}
              width={width}
              height={height}
              fill="url(#node-bg)"
              stroke={stroke}
              style={{ pointerEvents: disablePointer ? 'none' : 'initial' }}
              strokeWidth={1.5}
              onMouseMove={dragMove}
              onMouseUp={dragEnd}
              onMouseDown={dragStart}
              onTouchStart={dragStart}
              onTouchMove={dragMove}
              onTouchEnd={dragEnd}
              opacity={0.75}
            />
            <rect
              x={0.75}
              y={0.75}
              rx={5}
              style={{ pointerEvents: 'none' }}
              width={width - 1.5}
              height={25}
              fill="#000"
              opacity={0.5}
            />
            <text
              x={10}
              y={18}
              fill={COLOR_TEXT}
              fontSize={12}
              fontWeight="bold"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {label}
            </text>
          </>
        )
      }

      return (
        <>
          <g transform={`translate(${nodeX}, ${nodeY})`}>
            {geom}
          </g>

          {hotspots.map((hotspot) => {
            const key = `${hotspot.nodeId}.${hotspot.name}`
            return (
              <GraphHotspotItem
                color={hotspot.color || ''}
                disablePointer={disablePointer}
                isConnected={!!connectedHotpotIds[key]}
                key={key}
                onConnectionEnd={onConnectionEnd}
                onConnectionStart={() => onConnectionStart(hotspot, nodeX, nodeY)}
                onConnectionMove={onConnectionMove}
                title={hotspot.title || ''}
                transform={`translate(${nodeX}, ${nodeY})`}
                x={hotspot.offsetX}
                y={hotspot.offsetY}
                scaleX={scaleX}
                scaleY={scaleY}
                placement={hotspot.placement}
                connectionType={hotspot.connectionType}
                size={4}
                textVisible={hotspot.textVisible}
              />
            )
          })}
        </>
      )
    }}
  </Drag>
)

export default GraphNodeItem
