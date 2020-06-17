import _reduce from 'lodash/reduce'
import React from 'react'

import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { changeNode, changePort } from 'store/blueprint/actions'
import { getConnectionHints, getSelectedNode } from 'store/selection/selectors'
import { Node, Port } from 'store/blueprint/types'
import { ReduxState } from 'store/types'
import {
  Collapse,
  Input,
  InputNumber,
} from 'antd'
import { CaretRightOutlined } from '@ant-design/icons'

import PortEditor from 'components/PortEditor'

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
      <Collapse
        defaultActiveKey="ports"
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      >
        <Collapse.Panel
          header="Properties"
          key="props"
          style={{ padding: 0 }}
        >
          <div style={{ display: 'table', width: '100%' }}>
            <div style={{ display: 'table-row' }}>
              <span style={{ display: 'table-cell' }}>Label:</span>
              <Input
                style={{ display: 'table-cell' }}
                onChange={(ev) => onChangeNode(node.uid, { label: ev.target.value })}
                value={node.label}
              />
            </div>
            <div style={{ display: 'table-row' }}>
              <span style={{ display: 'table-cell' }}>X:</span>
              <InputNumber
                style={{ display: 'table-cell' }}
                onChange={(value) => onChangeNode(node.uid, { x: value })}
                value={node.x}
              />
            </div>
            <div style={{ display: 'table-row' }}>
              <span style={{ display: 'table-cell' }}>Y:</span>
              <InputNumber
                style={{ display: 'table-cell' }}
                onChange={(value) => onChangeNode(node.uid, { y: value })}
                value={node.y}
              />
            </div>
            <div style={{ display: 'table-row' }}>
              <span style={{ display: 'table-cell' }}>Witdth:</span>
              <InputNumber
                style={{ display: 'table-cell' }}
                onChange={(value) => onChangeNode(node.uid, { width: value })}
                value={node.width}
              />
            </div>
            <div style={{ display: 'table-row' }}>
              <span style={{ display: 'table-cell' }}>Height:</span>
              <InputNumber
                style={{ display: 'table-cell' }}
                onChange={(value) => onChangeNode(node.uid, { height: value })}
                value={node.height}
              />
            </div>
          </div>
        </Collapse.Panel>
        <Collapse.Panel header="Inputs" key="ports">
          <div style={{ display: 'table', width: '100%' }}>
            {_reduce(
              node.ports,
              (acc: Array<React.ReactNode>, port: Port): Array<React.ReactNode> => {
                if (port.direction === 'input') {
                  acc.push((
                    <PortEditor
                      key={`${node.uid}.${port.name}`}
                      connectionHint={connectionHints[port.name]}
                      onChange={(value) => onChangePort(node.uid, port.name, { value })}
                      port={port}
                    />
                  ))
                }
                return acc
              }, [],
            )}
          </div>
        </Collapse.Panel>
      </Collapse>
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
