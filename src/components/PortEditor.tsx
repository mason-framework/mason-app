import React from 'react'
import {
  Input,
  InputNumber,
  Select,
  Switch,
} from 'antd'
import { EyeInvisibleFilled } from '@ant-design/icons'

import { Port } from 'store/blueprint/types'

interface Props {
  port: Port
}

interface FormProps extends Props {
  connectionHint: string
}

interface Actions {
  onChange(value: any): void
}

const BooleanEditor = ({ onChange, port }: Props & Actions) => (
  <Switch
    onChange={onChange}
    checked={port.value === undefined ? port.default : port.value}
  />
)

const NumberEditor = ({ onChange, port }: Props & Actions) => (
  <InputNumber
    onChange={onChange}
    placeholder={port.default}
    value={port.value}
  />
)

const StringEditor = ({ onChange, port }: Props & Actions) => {
  if (port.schema.choices) {
    return (
      <Select
        defaultValue={port.value === undefined ? port.default : port.value}
      >
        {port.schema.choices.map((choice) => (
          <Select.Option value={choice}>{choice}</Select.Option>
        ))}
      </Select>
    )
  }
  return (
    <Input
      placeholder={port.default}
      onChange={(ev) => onChange(ev.target.value)}
      value={port.value}
    />
  )
}

const EDITORS: Record<string, (props: Props & Actions) => React.ReactElement> = {
  bool: BooleanEditor,
  float: NumberEditor,
  int: NumberEditor,
  str: StringEditor,
  'typing.Any': StringEditor,
}

const PortEditor = ({ connectionHint, onChange, port }: FormProps & Actions) => {
  const editorType = EDITORS[port.type]
  let editor
  if (connectionHint) {
    editor = <Input disabled placeholder={connectionHint} />
  } else if (editorType) {
    editor = React.createElement(editorType, { onChange, port })
  } else {
    editor = port.type
  }
  return (
    <div style={{ display: 'table-row' }}>
      <div style={{ display: 'table-cell' }}>
        <EyeInvisibleFilled style={{ color: '#303030' }} />
      </div>
      <div style={{ display: 'table-cell' }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#303030',
            marginRight: 2,
          }}
          title={port.type}
        />
      </div>
      <div style={{ display: 'table-cell' }}>
        {`${port.label}:`}
      </div>
      <div style={{ display: 'table-cell' }}>
        {editor}
      </div>
    </div>
  )
}

export default PortEditor
