import React from 'react'
import { NodeTimeline } from 'store/profile/types'
import { AutoSizer } from 'react-virtualized'

import TimelineGraph from 'components/TimelineGraph'

import {
  Button,
  Form,
  Space,
  Switch,
  Typography,
} from 'antd'

const { Text } = Typography

interface Props {
  enabled: boolean
  timelines: Array<NodeTimeline>
  totalTime: number
}

interface Actions {
  onClear(): void
  onToggle(enabled: boolean): void
}

const LogPanel = ({
  enabled,
  timelines,
  totalTime,
  onClear,
  onToggle,
}: Props & Actions) => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Form layout="inline" size="small">
      <Form.Item label="Enabled">
        <Switch onChange={onToggle} checked={enabled} />
      </Form.Item>
      <Form.Item>
        <Text>{`Duration: ${totalTime.toFixed(2)}s`}</Text>
      </Form.Item>
      <Form.Item>
        <Button disabled={!enabled} onClick={onClear}>Clear Events</Button>
      </Form.Item>
    </Form>
    <div style={{ height: 310 }}>
      <AutoSizer>
        {({ width, height }) => (
          <TimelineGraph
            height={height}
            timelines={timelines}
            totalTime={totalTime}
            width={width}
          />
        )}
      </AutoSizer>
    </div>
  </Space>
)

export default LogPanel
