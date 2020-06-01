import React from 'react'
import { Button, Tabs } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import LogPanel from 'components/LogPanel'

import { ReduxState } from 'store/types'
import { closeWorkflow } from 'store/app/actions'
import { clearLogs, changeLevel } from 'store/logs/actions'
import { getLogs, getLevel as getLogLevel } from 'store/logs/selectors'

interface Props {
  logs: Array<string>
  logLevel: string
}

interface Actions {
  onClearLogs(): void
  onClose(): void
  onChangeLogLevel(level: string): void
}

const TAB_PANE_STYLE = {
  display: 'flex',
  flex: 1,
  padding: 8,
  background: '#141414',
}

const WorkflowView = ({
  logs,
  logLevel,
  onClearLogs,
  onClose,
  onChangeLogLevel,
}: Props & Actions) => (
  <div style={{ position: 'relative' }}>
    <Tabs
      type="card"
      tabBarGutter={0}
      tabBarStyle={{ marginBottom: 0 }}
      tabBarExtraContent={(
        <Button onClick={onClose} type="link" ghost><CloseOutlined /></Button>
      )}
    >
      <Tabs.TabPane tab="Logging" key="logging" style={TAB_PANE_STYLE}>
        <LogPanel
          logs={logs}
          onClear={onClearLogs}
          level={logLevel}
          onChangeLevel={onChangeLogLevel}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Runs" key="execution">
        B
      </Tabs.TabPane>
      <Tabs.TabPane tab="Console" key="console">
        C
      </Tabs.TabPane>
    </Tabs>
  </div>
)

const selector = createStructuredSelector<ReduxState, Props>({
  logs: getLogs,
  logLevel: getLogLevel,
})

const actions = {
  onClearLogs: clearLogs,
  onClose: closeWorkflow,
  onChangeLogLevel: changeLevel,
}

export default connect(selector, actions)(WorkflowView)
