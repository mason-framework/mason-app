import React from 'react'

import { AutoSizer } from 'react-virtualized'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getLibraryNodeTree } from 'store/tree/selectors'
import { Input, Tree } from 'antd'
import { searchLibraryNode } from 'store/tree/actions'
import { LibraryNodeTreeItemModel } from 'store/tree/types'
import { ReduxState } from 'store/types'
import { SearchOutlined } from '@ant-design/icons'

interface Props {
  treeData: Array<LibraryNodeTreeItemModel>
}

interface Actions {
  onSearchChange: typeof searchLibraryNode
}

const NodeView = ({ onSearchChange, treeData }: Props & Actions) => (
  <AutoSizer>
    {({ width, height }) => (
      <div style={{ width, height, padding: '0 6px' }}>
        <Input
          onChange={(ev) => onSearchChange(ev.target.value)}
          placeholder="search..."
          prefix={(<SearchOutlined />)}
        />
        <div style={{ margin: '6px 0' }} />
        <Tree
          blockNode
          height={height - 50}
          treeData={treeData}
        />
      </div>
    )}
  </AutoSizer>
)

const selector = createStructuredSelector<ReduxState, Props>({
  treeData: getLibraryNodeTree,
})

const actions: Actions = {
  onSearchChange: searchLibraryNode,
}

export default connect(selector, actions)(NodeView)
