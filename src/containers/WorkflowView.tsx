import React from 'react'
import { Button, Tabs } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { AutoSizer } from 'react-virtualized'

import LogPanel from 'components/LogPanel'
import ProfilePanel from 'components/ProfilePanel'
import RunPanel from 'components/RunPanel'

import { ReduxState } from 'store/types'
import { closeWorkflow, changeWorkflowTab } from 'store/app/actions'
import { getWorkflowTab } from 'store/app/selectors'
import {
  clearLogs,
  changeLevel,
  toggleLogs,
} from 'store/logs/actions'
import {
  getLogs,
  getEnabled as getLogsEnabled,
  getLevel as getLogLevel,
} from 'store/logs/selectors'
import {
  clearEvents,
  changeEnabled as changeProfile,
} from 'store/profile/actions'
import {
  getRequestTime,
  getTotalTime,
  getTimeline,
  getEnabled as getProfileEnabled,
} from 'store/profile/selectors'
import { getCurrentRunId, getRuns } from 'store/runs/selectors'
import { clearRuns, startRun } from 'store/runs/actions'
import { Run } from 'store/runs/types'
import { NodeTimeline } from 'store/profile/types'

interface Props {
  currentRunId: string
  logsEnabled: boolean
  logs: Array<string>
  logLevel: string
  profileEnabled: boolean
  profileTimelines: Array<NodeTimeline>
  profileTotalTime: number
  profileRequestTime: number
  runs: Array<Run>
  tab: string
}

interface Actions {
  onClearLogs(): void
  onClose(): void
  onChangeLogLevel(level: string): void
  onClearEvents(): void
  onRun(): void
  onClearRuns(): void
  onTabChange(tab: string): void
  onToggleLogs(): void
  onToggleProfile(enabled: boolean): void
}

const TAB_PANE_STYLE = {
  display: 'flex',
  flex: 1,
  padding: 8,
  background: '#141414',
}

const WorkflowView = ({
  currentRunId,
  logsEnabled,
  logs,
  logLevel,
  profileEnabled,
  profileRequestTime,
  profileTimelines,
  profileTotalTime,
  runs,
  onClearEvents,
  onClearRuns,
  onClearLogs,
  onClose,
  onChangeLogLevel,
  onTabChange,
  onToggleLogs,
  onToggleProfile,
  onRun,
  tab,
}: Props & Actions) => (
  <AutoSizer>
    {({ width, height }) => (
      <div style={{ position: 'relative', width, height }}>
        <Tabs
          defaultActiveKey={tab}
          onChange={onTabChange}
          type="card"
          tabBarGutter={0}
          tabBarStyle={{ marginBottom: 0 }}
          tabBarExtraContent={(
            <Button onClick={onClose} type="link" ghost><CloseOutlined /></Button>
          )}
        >
          <Tabs.TabPane tab="Runs" key="runs" style={TAB_PANE_STYLE}>
            <RunPanel
              currentId={currentRunId}
              runs={runs}
              onClear={onClearRuns}
              onRun={onRun}
              height={height - 100}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Logs" key="logging" style={TAB_PANE_STYLE}>
            <LogPanel
              enabled={logsEnabled}
              logs={logs}
              onClear={onClearLogs}
              level={logLevel}
              onChangeLevel={onChangeLogLevel}
              onToggle={onToggleLogs}
              height={height - 100}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Profile" key="profiling" style={TAB_PANE_STYLE}>
            <ProfilePanel
              onClear={onClearEvents}
              onToggle={onToggleProfile}
              enabled={profileEnabled}
              timelines={profileTimelines}
              totalTime={Math.max(profileTotalTime, profileRequestTime)}
              height={height - 100}
              width={width - 20}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    )}
  </AutoSizer>
)

const selector = createStructuredSelector<ReduxState, Props>({
  currentRunId: getCurrentRunId,
  logsEnabled: getLogsEnabled,
  logs: getLogs,
  logLevel: getLogLevel,
  profileEnabled: getProfileEnabled,
  profileTotalTime: getTotalTime,
  profileRequestTime: getRequestTime,
  profileTimelines: getTimeline,
  runs: getRuns,
  tab: getWorkflowTab,
})

const actions = {
  onClearRuns: clearRuns,
  onClearLogs: clearLogs,
  onClose: closeWorkflow,
  onChangeLogLevel: changeLevel,
  onClearEvents: clearEvents,
  onTabChange: changeWorkflowTab,
  onToggleLogs: toggleLogs,
  onToggleProfile: changeProfile,
  onRun: startRun,
}

export default connect(selector, actions)(WorkflowView)
