import React from 'react'
import { NodeTimeline } from 'store/profile/types'

import TimelineGraph from 'components/TimelineGraph'

import {
  Button,
  Form,
  Switch,
  Typography,
} from 'antd'

const { Text } = Typography

interface Props {
  enabled: boolean
  timelines: Array<NodeTimeline>
  totalTime: number
  width: number
  height: number
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
  width,
  height,
}: Props & Actions) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
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
    <div style={{ flex: 1, marginTop: 8 }}>
      <TimelineGraph
        height={height}
        timelines={timelines}
        totalTime={totalTime}
        width={width}
      />
    </div>
  </div>
)

export default LogPanel
