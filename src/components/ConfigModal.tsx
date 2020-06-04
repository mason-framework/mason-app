import React from 'react'

import {
  Divider,
  Form,
  Input,
  Modal,
  Select,
} from 'antd'
import {
  LOCALES,
  THEMES,
  Config,
} from 'store/app/types'

interface Props {
  config: Config
  title: string
  visible: boolean
}

interface Actions {
  onSave(config: Config): void
  onClose(): void
}


const ConfigModal = ({
  config,
  onClose,
  onSave,
  title,
  visible,
}: Props & Actions) => {
  const [form] = Form.useForm()
  return (
    <Modal
      okText="Save"
      cancelText="Cancel"
      onCancel={() => {
        form.resetFields()
        onClose()
      }}
      onOk={() => {
        form.validateFields().then((values) => {
          onSave(values as Config)
          onClose()
        })
      }}
      title={title}
      visible={visible}
    >
      <Form
        form={form}
        initialValues={config}
      >
        <Form.Item name="locale" label="Locale">
          <Select>
            {LOCALES.map((locale) => <Select.Option value={locale}>{locale}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="theme" label="Theme">
          <Select>
            {THEMES.map((theme) => <Select.Option value={theme}>{theme}</Select.Option>)}
          </Select>
        </Form.Item>

        <Divider>API</Divider>

        <Form.Item name="apiHost" label="Host">
          <Input />
        </Form.Item>
        <Form.Item name="apiToken" label="Token">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ConfigModal
