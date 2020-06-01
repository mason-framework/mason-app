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

import { getLocale, getMessages, getWorkflowVisible } from 'store/app/selectors'
import { initialize, closeWorkflow, openWorkflow } from 'store/app/actions'
import { executeBlueprint } from 'store/blueprint/actions'
import { ReduxState } from 'store/types'

import BlueprintNavBar from 'containers/BlueprintNavBar'
import MenuBar from 'containers/MenuBar'
import GraphView from 'containers/GraphView'
import LibraryView from 'containers/LibraryView'
import NodeForm from 'containers/NodeForm'
import WorkflowView from 'containers/WorkflowView'

const { Footer, Sider, Content } = Layout


interface Props {
  locale: string
  messages: Record<string, string>
  workflowVisible: boolean
}

interface Actions {
  onCloseWorkflow(): void
  onOpenWorkflow(): void
  onInitialize(): void
  onUndo(): void
  onRedo(): void
  onExecute(): void
}


class App extends Component<Props & Actions> {
  componentDidMount() {
    const { onInitialize } = this.props
    onInitialize()
  }

  render() {
    const {
      locale,
      messages,
      onUndo,
      onRedo,
      onExecute,
      onOpenWorkflow,
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
                  <BlueprintNavBar />
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
                    <Button type="link" ghost onClick={onOpenWorkflow}>Logging</Button>
                    <Button type="link" ghost onClick={onOpenWorkflow}>Runs</Button>
                    <Button type="link" ghost onClick={onOpenWorkflow}>Console</Button>
                  </Space>
                </Footer>
              )}
            </Layout>
          </HotKeys>
        </DndProvider>
      </IntlProvider>
    )
  }
}

const selector = createStructuredSelector<ReduxState, Props>({
  locale: getLocale,
  messages: getMessages,
  workflowVisible: getWorkflowVisible,
})

const actions: Actions = {
  onInitialize: initialize,
  onUndo: ActionCreators.undo,
  onRedo: ActionCreators.redo,
  onCloseWorkflow: closeWorkflow,
  onOpenWorkflow: openWorkflow,
  onExecute: executeBlueprint,
}

export default connect(selector, actions)(App)
