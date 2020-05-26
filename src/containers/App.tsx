import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { IntlProvider } from 'react-intl'
import { Layout } from 'antd'
import React, { Component } from 'react'
import { DndProvider } from 'react-dnd'
import DndBackend from 'react-dnd-html5-backend'

import { getLocale, getMessages } from 'store/app/selectors'
import { initialize as initializeApp } from 'store/app/actions'
import { ReduxState } from 'store/types'
import GraphView from 'containers/GraphView'
import NodeView from 'containers/NodeView'

const { Header, Sider, Content } = Layout


interface Props {
  locale: string,
  messages: Record<string, string>,
}

interface Actions {
  initialize: typeof initializeApp
}


class App extends Component<Props & Actions> {
  componentDidMount() {
    const { initialize } = this.props
    initialize()
  }

  render() {
    const { locale, messages }: Props = this.props
    return (
      <IntlProvider
        key={locale}
        locale={locale}
        messages={messages}
      >
        <DndProvider backend={DndBackend}>
          <Layout style={{ height: '100vh' }}>
            <Header />
            <Layout>
              <Sider>
                <NodeView />
              </Sider>
              <Content>
                <GraphView />
              </Content>
            </Layout>
          </Layout>
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
  initialize: initializeApp,
}

export default connect(selector, actions)(App)
