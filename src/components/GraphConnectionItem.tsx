import React from 'react'
import { curveBasis } from '@vx/curve'
import { LinePath } from '@vx/shape'
import { LinearGradient } from '@vx/gradient'

import { Position } from 'store/blueprint/types'
import { COLOR_SELECTED_STROKE } from 'store/graph/colors'

interface Props {
  uid: string,
  sourcePos: Position
  sourceColor: string
  targetPos: Position
  selected: boolean
  stroke?: string
  targetColor: string
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
  sourceColor,
  stroke,
  targetPos,
  targetColor,
  sourcePlacement,
  targetPlacement,
}: Props & Actions) => {
  const startX = sourcePos.x + sourcePos.offsetX
  const startY = sourcePos.y + sourcePos.offsetY
  const endX = targetPos.x + targetPos.offsetX
  const endY = targetPos.y + targetPos.offsetY

  const midX = startX + (endX - startX) / 2
  const midY = startY + (endY - startY) / 2

  let color = stroke || sourceColor
  if (selected) {
    color = COLOR_SELECTED_STROKE
  }

  const data = [{ x: startX, y: startY }]
  if (sourcePlacement === 'right' && targetPlacement === 'left') {
    if (startY !== endY) {
      data.push({ x: midX, y: startY })
      data.push({ x: midX, y: endY })
    }
  } else if (sourcePlacement === 'bottom' && targetPlacement === 'top') {
    if (startX !== endX) {
      data.push({ x: startX, y: midY })
      data.push({ x: endX, y: midY })
    }
  }
  data.push({ x: endX, y: endY })
  const useGradient = !selected && startY !== endY && sourceColor !== targetColor

  return (
    <>
      {useGradient && (
        <LinearGradient
          id={uid}
          from={startY < endY ? sourceColor : targetColor}
          to={startY < endY ? targetColor : sourceColor}
        />
      )}
      <LinePath
        curve={startX !== endX ? curveBasis : undefined}
        stroke={useGradient ? `url(#${uid})` : color}
        strokeWidth={2}
        data={data}
        onClick={() => onSelect(uid)}
        x={({ x }) => x}
        y={({ y }) => y}
      />
    </>
  )
}

export default GraphConnectionItem
