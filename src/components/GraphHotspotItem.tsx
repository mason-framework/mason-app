import React from 'react'
import { Drag } from '@vx/drag'
import { COLOR_BG, COLOR_TEXT } from 'store/graph/colors'

interface Props {
  dragWidth?: number
  dragHeight?: number
  color?: string
  disablePointer: boolean
  isConnected: boolean
  title: string
  transform: string
  x: number
  y: number
  scaleX: number
  scaleY: number
  connectionType: string
  placement: string
  size: number
  textVisible: boolean
}

interface Actions {
  onConnectionStart(): any
  onConnectionMove(dx: number, dy: number): any
  onConnectionEnd(x: number, y: number): any
}

const GraphHotspotItem = ({
  dragWidth = 10000,
  dragHeight = 10000,
  color = COLOR_BG,
  disablePointer,
  isConnected,
  onConnectionEnd,
  onConnectionMove,
  onConnectionStart,
  title,
  transform,
  x,
  y,
  scaleX,
  scaleY,
  size,
  connectionType,
  placement,
  textVisible,
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
    }) => {
      let graphic: React.ReactNode
      if (connectionType === 'data') {
        let rotation = 0
        if (placement === 'right') {
          rotation = 180
        } else if (placement === 'top') {
          rotation = 90
        } else if (placement === 'bottom') {
          rotation = -90
        }
        graphic = (
          <g transform={`rotate(${rotation})`}>
            <circle
              r={size}
              fill={isConnected ? color : 'transparent'}
              stroke={color}
              strokeWidth={1.5}
            >
              <title>{title}</title>
            </circle>
            <path
              stroke={color}
              strokeWidth={1.5}
              d={`M -${size} 0 H -${size + 3} V -${size / 2} V ${size / 2}`}
            />
          </g>
        )
      } else {
        graphic = (
          <path
            fill={isConnected ? color : 'transparent'}
            stroke={color}
            strokeWidth={1.5}
            d={`M -${size + 0.5} -${size} H 0 L ${size} 0 L 0 ${size} H -${size} V -${size + 0.5}`}
          >
            <title>{title}</title>
          </path>
        )
      }

      let textAnchor = 'start'
      let textX = size * 2
      if (placement === 'right') {
        textAnchor = 'end'
        textX = -textX
      }

      return (
        <g transform={transform}>
          <g transform={`translate(${x}, ${y})`}>
            <g
              style={{ pointerEvents: disablePointer ? 'none' : 'initial' }}
              onMouseMove={dragMove}
              onMouseUp={dragEnd}
              onMouseDown={dragStart}
              onTouchStart={dragStart}
              onTouchMove={dragMove}
              onTouchEnd={dragEnd}
            >
              {graphic}
            </g>
            {textVisible && (
              <text
                textAnchor={textAnchor}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
                x={textX}
                y={size - 1}
                fontSize={10}
                fill={COLOR_TEXT}
              >
                {title}
              </text>
            )}
          </g>
        </g>
      )
    }}
  </Drag>
)

export default GraphHotspotItem
