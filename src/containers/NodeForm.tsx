import _reduce from 'lodash/reduce'
import React from 'react'

import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { nodePropertyChanger, changePortValue } from 'store/blueprint/actions'
import { getSelectedNode } from 'store/blueprint/selectors'
import { getSelectedConnectionTargets } from 'store/graph/selectors'
import { Node, Port } from 'store/blueprint/types'
import { ReduxState } from 'store/types'
import { Divider, Typography, Form } from 'antd'
import PortFormItem from 'components/PortFormItem'

const { Text } = Typography

interface Props {
  node?: Node
  connectedTargets: Record<string, Array<string>>
}

interface Actions {
  onChangeLabel(uid: string, label: string): void
  onChangePort(uid: string, portName: string, value: any): void
}

const NodeForm = ({
  connectedTargets,
  node,
  onChangeLabel,
  onChangePort,
}: Props & Actions) => (
  <div style={{ padding: 8 }}>
    {!!node && (
      <>
        <Text editable={{ onChange: (value: string) => onChangeLabel(node.uid, value) }}>
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
                    connections={connectedTargets[port.name]}
                    onChange={(value) => onChangePort(node.uid, port.name, value)}
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
  connectedTargets: getSelectedConnectionTargets,
})

const actions = {
  onChangeLabel: nodePropertyChanger('label'),
  onChangePort: changePortValue,
}

export default connect(selector, actions)(NodeForm)
