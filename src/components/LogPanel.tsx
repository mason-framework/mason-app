import React from 'react'

import {
  Button,
  Form,
  Select,
  Space,
  Input,
} from 'antd'

interface Props {
  logs: Array<string>
  level: string
}

interface Actions {
  onClear(): void
  onChangeLevel(level: string): void
}

const LogPanel = ({
  level,
  logs,
  onClear,
  onChangeLevel,
}: Props & Actions) => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Form layout="inline" size="small">
      <Form.Item label="Log Level">
        <Select onChange={onChangeLevel} defaultValue={level} style={{ width: 150 }}>
          <Select.Option value="DEBUG">DEBUG</Select.Option>
          <Select.Option value="INFO">INFO</Select.Option>
          <Select.Option value="WARN">WARN</Select.Option>
          <Select.Option value="ERROR">ERROR</Select.Option>
          <Select.Option value="CRITICAL">CRITICAL</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button onClick={onClear}>Clear Logs</Button>
      </Form.Item>
    </Form>
    <Input.TextArea
      style={{
        height: 310,
        fontFamily: 'monospace',
        background: 'black',
        color: 'white',
      }}
      value={logs.join('')}
    />
  </Space>
)

export default LogPanel
