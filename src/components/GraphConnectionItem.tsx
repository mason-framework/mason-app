import React from 'react'
import { curveBasis } from '@vx/curve'
import { LinePath } from '@vx/shape'

interface Props {
  sourceX: number
  sourceY: number
  sourceOffsetX: number
  sourceOffsetY: number
  targetX: number
  targetY: number
  targetOffsetX: number
  targetOffsetY: number
  stroke?: string
}

const GraphConnectionItem = ({
  sourceOffsetX,
  sourceOffsetY,
  sourceX,
  sourceY,
  stroke = 'white',
  targetOffsetX,
  targetOffsetY,
  targetX,
  targetY,
}: Props) => {
  const startX = sourceX + sourceOffsetX
  const startY = sourceY + sourceOffsetY
  const endX = targetX + targetOffsetX
  const endY = targetY + targetOffsetY

  const midX = startX + (endX - startX) / 2

  const data = [
    { x: startX, y: startY },
    { x: midX, y: startY },
    { x: midX, y: endY },
    { x: endX, y: endY },
  ]

  return (
    <LinePath
      curve={curveBasis}
      stroke={stroke}
      strokeWidth={2}
      data={data}
      x={({ x }) => x}
      y={({ y }) => y}
    />
  )
}

export default GraphConnectionItem
