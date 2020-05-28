import React from 'react'

import { AutoSizer } from 'react-virtualized'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getNodeTree, getSearchTerms } from 'store/library/selectors'
import { Tabs, Input, Tree } from 'antd'
import { LibraryTreeNode } from 'store/library/types'
import { ReduxState } from 'store/types'
import { searchLibrary } from 'store/library/actions'
import { SearchOutlined } from '@ant-design/icons'

const { TabPane } = Tabs

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
        <Tabs defaultActiveKey="nodes" size="small">
          <TabPane tab="Nodes" key="nodes">
            <Input
              onChange={(ev) => onSearchChange(ev.target.value)}
              placeholder="search..."
              prefix={(<SearchOutlined />)}
              value={searchTerms}
            />
            <div style={{ margin: '6px 0' }} />
            <Tree
              blockNode
              height={height - 50}
              treeData={treeData}
            />
          </TabPane>
          <TabPane tab="Blueprints" key="blueprints">
            <Input
              onChange={(ev) => onSearchChange(ev.target.value)}
              placeholder="search..."
              prefix={(<SearchOutlined />)}
              value={searchTerms}
            />
          </TabPane>
        </Tabs>
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
