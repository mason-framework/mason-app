import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { IntlProvider } from 'react-intl'
import {
  Space,
  Button,
  Layout,
} from 'antd'
import React, { Component } from 'react'
import { DndProvider } from 'react-dnd'
import DndBackend from 'react-dnd-html5-backend'
import { ActionCreators } from 'redux-undo'
import { HotKeys } from 'react-hotkeys'

import {
  getConfig,
  getConfigVisible,
  getLocale,
  getMessages,
  getWorkflowVisible,
} from 'store/app/selectors'
import {
  getIsModalVisible as getStorageVisible,
} from 'store/storage/selectors'
import {
  changeConfig,
  closeWorkflow,
  initialize,
  openWorkflow,
  toggleConfig,
} from 'store/app/actions'
import { Config } from 'store/app/types'
import { startRun } from 'store/runs/actions'
import { ReduxState } from 'store/types'

import ConfigModal from 'components/ConfigModal'
import StorageModal from 'containers/StorageModal'

import MenuBar from 'containers/MenuBar'
import GraphView from 'containers/GraphView'
import LibraryView from 'containers/LibraryView'
import NodeForm from 'containers/NodeForm'
import WorkflowView from 'containers/WorkflowView'

const { Footer, Sider, Content } = Layout


interface Props {
  config: Config
  configVisible: boolean
  locale: string
  messages: Record<string, string>
  workflowVisible: boolean
  storageVisible: boolean
}

interface Actions {
  onCloseConfig(): void
  onCloseWorkflow(): void
  onExecute(): void
  onInitialize(): void
  onOpenWorkflow(tab: string): void
  onRedo(): void
  onSaveConfig(config: Config): void
  onUndo(): void
}


class App extends Component<Props & Actions> {
  componentDidMount() {
    const { onInitialize } = this.props
    onInitialize()
  }

  render() {
    const {
      config,
      configVisible,
      locale,
      messages,
      onCloseConfig,
      onExecute,
      onOpenWorkflow,
      onRedo,
      onSaveConfig,
      onUndo,
      storageVisible,
      workflowVisible,
    } = this.props
    return (
      <IntlProvider
        key={locale}
        locale={locale}
        messages={messages}
      >
        <DndProvider backend={DndBackend}>
          <HotKeys
            keyMap={{
              UNDO: ['cmd+z'],
              REDO: ['cmd+shift+z'],
              EXECUTE: ['cmd+enter'],
            }}
            handlers={{
              UNDO: onUndo,
              REDO: onRedo,
              EXECUTE: onExecute,
            }}
          >
            <Layout style={{ height: '100vh' }}>
              <MenuBar />
              <Layout>
                <Sider collapsible collapsedWidth={0}>
                  <LibraryView />
                </Sider>
                <Content>
                  <GraphView />
                </Content>
                <Sider collapsible collapsedWidth={0} reverseArrow width={350}>
                  <NodeForm />
                </Sider>
              </Layout>
              {workflowVisible ? (
                <WorkflowView />
              ) : (
                <Footer style={{ background: '#141414', borderTop: '1px solid black', padding: 3 }}>
                  <Space>
                    <Button type="link" ghost onClick={() => onOpenWorkflow('runs')}>Runs</Button>
                    <Button type="link" ghost onClick={() => onOpenWorkflow('logging')}>Logging</Button>
                    <Button type="link" ghost onClick={() => onOpenWorkflow('profiling')}>Profiling</Button>
                  </Space>
                </Footer>
              )}
            </Layout>
            {configVisible && (
              <ConfigModal
                title="Preferences"
                config={config}
                onClose={onCloseConfig}
                onSave={onSaveConfig}
                visible
              />
            )}
            {storageVisible && <StorageModal />}
          </HotKeys>
        </DndProvider>
      </IntlProvider>
    )
  }
}

const selector = createStructuredSelector<ReduxState, Props>({
  config: getConfig,
  configVisible: getConfigVisible,
  locale: getLocale,
  messages: getMessages,
  workflowVisible: getWorkflowVisible,
  storageVisible: getStorageVisible,
})

const actions: Actions = {
  onCloseConfig: toggleConfig,
  onCloseWorkflow: closeWorkflow,
  onExecute: startRun,
  onInitialize: initialize,
  onOpenWorkflow: openWorkflow,
  onRedo: ActionCreators.redo,
  onSaveConfig: changeConfig,
  onUndo: ActionCreators.undo,
}

export default connect(selector, actions)(App)
