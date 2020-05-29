import React from 'react'

import { AutoSizer } from 'react-virtualized'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getNodeTree, getSearchTerms } from 'store/library/selectors'
import {
  Space,
  Select,
  Input,
  Tree,
} from 'antd'
import { LibraryTreeNode } from 'store/library/types'
import { ReduxState } from 'store/types'
import { searchLibrary } from 'store/library/actions'
import { SearchOutlined } from '@ant-design/icons'

interface Props {
  treeData: Array<LibraryTreeNode>
  searchTerms: string
}

interface Actions {
  onSearchChange: typeof searchLibrary
}

const LibraryView = ({
  onSearchChange,
  searchTerms,
  treeData,
}: Props & Actions) => (
  <AutoSizer>
    {({ width, height }) => (
      <div style={{ width, height, padding: 8 }}>
        <Space direction="vertical">
          <Select defaultValue="nodes" style={{ width: '100%' }}>
            <Select.Option value="nodes">Nodes</Select.Option>
            <Select.Option value="blueprints">Blueprints</Select.Option>
          </Select>
          <Input
            onChange={(ev) => onSearchChange(ev.target.value)}
            placeholder="search..."
            prefix={(<SearchOutlined />)}
            value={searchTerms}
          />
          <Tree
            blockNode
            height={height - 100}
            treeData={treeData}
          />
        </Space>
      </div>
    )}
  </AutoSizer>
)

const selector = createStructuredSelector<ReduxState, Props>({
  treeData: getNodeTree,
  searchTerms: getSearchTerms,
})

const actions: Actions = {
  onSearchChange: searchLibrary,
}

export default connect(selector, actions)(LibraryView)
