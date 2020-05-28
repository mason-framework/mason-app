import React from 'react'
import { curveBasis } from '@vx/curve'
import { LinePath } from '@vx/shape'
import { GraphPosition, COLORS_SELECTED_STROKE } from 'store/graph/types'

interface Props {
  uid: string,
  sourcePos: GraphPosition,
  targetPos: GraphPosition,
  selected: boolean
  stroke?: string
  sourcePlacement: string
  targetPlacement: string
}

interface Actions {
  onSelect(uid: string): void
}

const GraphConnectionItem = ({
  uid,
  onSelect,
  sourcePos,
  selected,
  stroke,
  targetPos,
  sourcePlacement,
  targetPlacement,
}: Props & Actions) => {
  const startX = sourcePos.x + sourcePos.offsetX
  const startY = sourcePos.y + sourcePos.offsetY
  const endX = targetPos.x + targetPos.offsetX
  const endY = targetPos.y + targetPos.offsetY

  const midX = startX + (endX - startX) / 2
  const midY = startY + (endY - startY) / 2

  let color = stroke || 'white'
  if (selected) {
    color = COLORS_SELECTED_STROKE
  }

  const data = [{ x: startX, y: startY }]
  if (sourcePlacement === 'right' && targetPlacement === 'left') {
    data.push({ x: midX, y: startY })
    data.push({ x: midX, y: endY })
  } else if (sourcePlacement === 'bottom' && targetPlacement === 'top') {
    data.push({ x: startX, y: midY })
    data.push({ x: endX, y: midY })
  }
  data.push({ x: endX, y: endY })

  return (
    <LinePath
      curve={curveBasis}
      stroke={color}
      strokeWidth={2}
      data={data}
      onClick={() => onSelect(uid)}
      x={({ x }) => x}
      y={({ y }) => y}
    />
  )
}

export default GraphConnectionItem
