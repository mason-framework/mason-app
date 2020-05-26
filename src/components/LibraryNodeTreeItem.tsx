import React from 'react'
import { dragLibraryNode } from 'store/tree/actions'
import { useDrag } from 'react-dnd'
import { LibraryNode } from 'store/server/types'

interface Props {
  nodeType: LibraryNode,
  name: string
}

const LibraryNodeTreeItem = ({ nodeType, name }: Props) => {
  const dragAction = dragLibraryNode(nodeType)
  const dragInfo = useDrag({ item: dragAction })
  return (
    <div ref={dragInfo[1]}>{name}</div>
  )
}

export default LibraryNodeTreeItem
