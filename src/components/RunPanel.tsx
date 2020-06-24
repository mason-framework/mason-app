import React from 'react'

import {
  Button,
  Form,
  Collapse,
} from 'antd'

import {
  STATUS_RUNNING,
  Run,
} from 'store/runs/types'

interface Props {
  currentId: string
  runs: Array<Run>
  height: number
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
  height,
}: Props & Actions) => (
  <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
    <Form layout="inline" size="small">
      <Form.Item>
        <Button onClick={onRun}>Run...</Button>
      </Form.Item>
      <Form.Item>
        <Button onClick={onClear}>Clear Runs</Button>
      </Form.Item>
    </Form>
    <div style={{ marginTop: 8, flex: 1 }}>
      <Collapse defaultActiveKey={currentId} style={{ height }}>
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
    </div>
  </div>
)

export default RunPanel
