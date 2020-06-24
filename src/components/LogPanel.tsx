import React from 'react'

import {
  Button,
  Form,
  Input,
  Select,
  Switch,
} from 'antd'

interface Props {
  enabled: boolean
  logs: Array<string>
  level: string
  height: number
}

interface Actions {
  onClear(): void
  onChangeLevel(level: string): void
  onToggle(): void
}

const LogPanel = ({
  height,
  enabled,
  level,
  logs,
  onChangeLevel,
  onClear,
  onToggle,
}: Props & Actions) => (
  <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
    <Form layout="inline" size="small">
      <Form.Item label="Enabled">
        <Switch onChange={onToggle} checked={enabled} />
      </Form.Item>
      <Form.Item label="Log Level">
        <Select
          disabled={!enabled}
          onChange={onChangeLevel}
          defaultValue={level}
          style={{ width: 150 }}
        >
          <Select.Option value="DEBUG">DEBUG</Select.Option>
          <Select.Option value="INFO">INFO</Select.Option>
          <Select.Option value="WARN">WARN</Select.Option>
          <Select.Option value="ERROR">ERROR</Select.Option>
          <Select.Option value="CRITICAL">CRITICAL</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button disabled={!enabled} onClick={onClear}>Clear Logs</Button>
      </Form.Item>
    </Form>
    <Input.TextArea
      disabled={!enabled}
      style={{
        fontFamily: 'monospace',
        background: '#0c0c0c',
        color: 'white',
        marginTop: 8,
        flex: 1,
        minHeight: height,
      }}
      value={logs.join('')}
      readOnly
    />
  </div>
)

export default LogPanel
