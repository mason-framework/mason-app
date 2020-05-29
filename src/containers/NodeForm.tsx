import _reduce from 'lodash/reduce'
import React from 'react'

import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { changeNode, changePort } from 'store/blueprint/actions'
import { getConnectionHints, getSelectedNode } from 'store/blueprint/selectors'
import { Node, Port } from 'store/blueprint/types'
import { ReduxState } from 'store/types'
import { Divider, Typography, Form } from 'antd'
import PortFormItem from 'components/PortFormItem'

const { Text } = Typography

interface Props {
  node?: Node
  connectionHints: Record<string, string>
}

interface Actions {
  onChangeNode(uid: string, properties: Record<string, any>): void
  onChangePort(uid: string, name: string, properties: Record<string, any>): void
}

const NodeForm = ({
  connectionHints,
  node,
  onChangeNode,
  onChangePort,
}: Props & Actions) => (
  <div style={{ padding: 8 }}>
    {!!node && (
      <>
        <Text editable={{ onChange: (value: string) => onChangeNode(node.uid, { label: value }) }}>
          {node.label}
        </Text>
        <Divider style={{ margin: '12px 0' }} />
        <Form
          size="small"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 32 }}
        >
          {_reduce(
            node.ports,
            (acc: Array<React.ReactNode>, port: Port): Array<React.ReactNode> => {
              if (port.direction === 'input') {
                acc.push((
                  <PortFormItem
                    key={port.name}
                    connectionHint={connectionHints[port.name]}
                    onChange={(value) => onChangePort(node.uid, port.name, { value })}
                    port={port}
                  />
                ))
              }
              return acc
            }, [],
          )}
        </Form>
      </>
    )}
  </div>
)

const selector = createStructuredSelector<ReduxState, Props>({
  node: getSelectedNode,
  connectionHints: getConnectionHints,
})

const actions = {
  onChangeNode: changeNode,
  onChangePort: changePort,
}

export default connect(selector, actions)(NodeForm)
