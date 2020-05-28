import React from 'react'
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from 'antd'

import { Port } from 'store/blueprint/types'

interface Props {
  port: Port
}

interface FormProps extends Props {
  connections: Array<string>
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
}

const PortFormItem = ({ connections, onChange, port }: FormProps & Actions) => {
  const editorType = EDITORS[port.type]
  if (connections) {
    return (
      <Form.Item
        label={port.label}
        name={port.name}
        style={{ marginBottom: 2 }}
      >
        <Input disabled placeholder={connections.join(', ')} />
      </Form.Item>
    )
  }
  if (editorType) {
    return (
      <Form.Item
        label={port.label}
        name={port.name}
        style={{ marginBottom: 2 }}
      >
        {React.createElement(editorType, { onChange, port })}
      </Form.Item>
    )
  }
  return (
    <Form.Item
      label={port.label}
      name={port.name}
      style={{ marginBottom: 2 }}
    >
      {port.type}
    </Form.Item>
  )
}

export default PortFormItem
