import React from 'react'

import {
  Button,
  Form,
  Space,
  Collapse,
} from 'antd'

import {
  STATUS_RUNNING,
  Run,
} from 'store/runs/types'

interface Props {
  currentId: string
  runs: Array<Run>
}

interface Actions {
  onClear(): void
  onRun(): void
}

const RunPanel = ({
  currentId,
  runs,
  onClear,
  onRun,
}: Props & Actions) => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Form layout="inline" size="small">
      <Form.Item>
        <Button onClick={onRun}>Run...</Button>
      </Form.Item>
      <Form.Item>
        <Button onClick={onClear}>Clear Runs</Button>
      </Form.Item>
    </Form>
    <Collapse defaultActiveKey={currentId} style={{ height: 310 }}>
      {runs.reverse().map((run, i) => (
        <Collapse.Panel
          key={run.uid}
          header={
            run.status === STATUS_RUNNING
              ? `Run #${runs.length - i} (Running...)`
              : `Run #${runs.length - i}`
          }
        >
          {run.status}
        </Collapse.Panel>
      ))}
    </Collapse>
  </Space>
)

export default RunPanel
