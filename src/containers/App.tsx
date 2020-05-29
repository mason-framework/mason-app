import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { IntlProvider } from 'react-intl'
import { Drawer, Layout } from 'antd'
import React, { Component } from 'react'
import { DndProvider } from 'react-dnd'
import DndBackend from 'react-dnd-html5-backend'
import { ActionCreators } from 'redux-undo'
import { HotKeys } from 'react-hotkeys'

import { getLocale, getMessages } from 'store/app/selectors'
import { initialize } from 'store/app/actions'
import { ReduxState } from 'store/types'

import BlueprintNavBar from 'containers/BlueprintNavBar'
import MenuBar from 'containers/MenuBar'
import GraphView from 'containers/GraphView'
import LibraryView from 'containers/LibraryView'
import NodeForm from 'containers/NodeForm'

const { Sider, Content } = Layout


interface Props {
  locale: string
  messages: Record<string, string>
}

interface Actions {
  onInitialize(): void
  onUndo(): void
  onRedo(): void
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
    } = this.props
    return (
      <IntlProvider
        key={locale}
        locale={locale}
        messages={messages}
      >
        <DndProvider backend={DndBackend}>
          <HotKeys
            keyMap={{ UNDO: ['cmd+z'], REDO: ['cmd+shift+z'] }}
            handlers={{ UNDO: onUndo, REDO: onRedo }}
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
            </Layout>
            <Drawer visible={false} placement="bottom" mask={false} />
          </HotKeys>
        </DndProvider>
      </IntlProvider>
    )
  }
}

const selector = createStructuredSelector<ReduxState, Props>({
  locale: getLocale,
  messages: getMessages,
})

const actions: Actions = {
  onInitialize: initialize,
  onUndo: ActionCreators.undo,
  onRedo: ActionCreators.redo,
}

export default connect(selector, actions)(App)
