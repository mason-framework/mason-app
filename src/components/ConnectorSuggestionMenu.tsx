import React from 'react'
import {
  Button,
  Input,
  List,
  Space,
  Typography,
} from 'antd'
import { CloseOutlined } from '@ant-design/icons'

import { ConnectorSuggestion } from 'store/graph/types'

const { Text } = Typography

interface Props {
  searchTerms: string
  suggestions: Array<ConnectorSuggestion>
  x: number
  y: number
}

interface Actions {
  onClose(): void
  onSuggestionPicked(suggestion: ConnectorSuggestion): void
  onSearch(terms: string): void
}

const MENU_STYLE: React.CSSProperties = {
  position: 'fixed',
  background: '#141414',
  border: '1px solid black',
  boxShadow: '5px 5px 10px black',
  zIndex: 1000,
}


const ConnectorSuggestionMenu = ({
  onClose,
  onSearch,
  onSuggestionPicked,
  searchTerms,
  suggestions,
  x,
  y,
}: Props & Actions) => (
  <div style={{ ...MENU_STYLE, left: x - 50, top: y - 20 }}>
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        background: 'black',
        padding: 6,
      }}
    >
      <Text>Suggestions</Text>
      <div style={{ flex: 1 }} />
      <Button onClick={onClose} type="link" ghost size="small">
        <CloseOutlined />
      </Button>
    </div>
    <Space direction="vertical" style={{ padding: 8 }}>
      <Input
        autoFocus
        onChange={(ev) => onSearch(ev.target.value)}
        onPressEnter={() => onSuggestionPicked(suggestions[0])}
        placeholder="search..."
        value={searchTerms}
      />
      <List style={{ maxHeight: 200, overflow: 'auto' }}>
        {suggestions.map(({ schema, name }) => {
          const uid = `${schema.group}--${schema.name}--${name}`
          return (
            <List.Item key={uid} style={{ padding: 8 }}>
              <Button onClick={() => onSuggestionPicked({ schema, name })} type="link" ghost>
                {`${schema.name}.${name}`}
                {'  '}
                <small>{`(from ${schema.group})`}</small>
              </Button>
            </List.Item>
          )
        })}
      </List>
    </Space>
  </div>
)

export default ConnectorSuggestionMenu
