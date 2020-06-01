import React from 'react'
import { Drag } from '@vx/drag'
import { COLOR_BG } from 'store/graph/colors'

interface Props {
  dragWidth?: number
  dragHeight?: number
  fill?: string
  isConnecting: boolean
  stroke: string
  title: string
  transform: string
  x: number
  y: number
  scaleX: number
  scaleY: number
}

interface Actions {
  onConnectionStart(): any
  onConnectionMove(dx: number, dy: number): any
  onConnectionEnd(x: number, y: number): any
}

const GraphHotspotItem = ({
  dragWidth = 10000,
  dragHeight = 10000,
  fill = COLOR_BG,
  isConnecting,
  onConnectionEnd,
  onConnectionMove,
  onConnectionStart,
  stroke,
  title,
  transform,
  x,
  y,
  scaleX,
  scaleY,
}: Props & Actions) => (
  <Drag
    width={dragWidth}
    height={dragHeight}
    onDragStart={() => (onConnectionStart())}
    onDragMove={({ dx, dy }) => (onConnectionMove(dx / scaleX, dy / scaleY))}
    onDragEnd={({ event }) => {
      const { pageX, pageY } = ((event as unknown) as React.MouseEvent).nativeEvent
      onConnectionEnd(pageX, pageY)
    }}
    resetOnStart
  >
    {({
      dragStart,
      dragEnd,
      dragMove,
    }) => (
      <g
        transform={transform}
        style={{ pointerEvents: isConnecting ? 'none' : 'initial' }}
        onMouseMove={dragMove}
        onMouseUp={dragEnd}
        onMouseDown={dragStart}
        onTouchStart={dragStart}
        onTouchMove={dragMove}
        onTouchEnd={dragEnd}
      >
        <circle
          cx={x}
          cy={y}
          r={5}
          fill={fill}
          stroke={stroke}
          strokeWidth={2}
        >
          <title>{title}</title>
        </circle>
      </g>
    )}
  </Drag>
)

export default GraphHotspotItem
