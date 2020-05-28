import React from 'react'
import { dragNodeSchema } from 'store/library/actions'
import { useDrag } from 'react-dnd'
import { NodeSchema } from 'store/library/types'

interface Props {
  node: NodeSchema,
  name: string
}

const LibraryTreeNodeItem = ({ node, name }: Props) => {
  const dragAction = dragNodeSchema(node)
  const dragInfo = useDrag({ item: dragAction })
  return (
    <div ref={dragInfo[1]}>{name}</div>
  )
}

export default LibraryTreeNodeItem
