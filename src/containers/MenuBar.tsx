import React from 'react'
import { Menu, Divider } from 'antd'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import {
  CopyOutlined,
  DeleteOutlined,
  FileOutlined,
  PlayCircleFilled,
  RedoOutlined,
  ScissorOutlined,
  SettingOutlined,
  SnippetsOutlined,
  UndoOutlined,
  UpSquareOutlined,
} from '@ant-design/icons'

import { toggleWorkflow } from 'store/app/actions'
import { initialize, executeBlueprint } from 'store/blueprint/actions'
import {
  copySelection,
  cutSelection,
  pasteSelection,
  deleteSelection,
} from 'store/selection/actions'

const { SubMenu } = Menu


interface Actions {
  onInitialize(): void
  onDeleteSelection(): void
  onExecute(): void
  onCopy(): void
  onCut(): void
  onPaste(): void
  onUndo(): void
  onRedo(): void
  onToggleWorkflow(): void
}

interface ClickEvent {
  key: string
}

const COPY_ACTION = 'COPY_ACTION'
const CUT_ACTION = 'CUT_ACTION'
const DELETE_ACTION = 'DELETE_ACTION'
const NEW_FILE_ACTION = 'NEW_FILE_ACTION'
const PASTE_ACTION = 'PASTE_ACTION'
const REDO_ACTION = 'REDO_ACTION'
const RUN_ACTION = 'RUN_ACTION'
const SAVE_FILE_ACTION = 'SAVE_FILE_ACTION'
const SAVE_FILE_AS_ACTION = 'SAVE_FILE_AS_ACTION'
const SHOW_PREFS_ACTION = 'SHOW_PREFS_ACTION'
const TOGGLE_WORKFLOW_ACTION = 'TOGGLE_WORKFLOW_ACTION'
const UNDO_ACTION = 'UNDO_ACTION'

interface ItemProps {
  icon?: React.ReactNode
  title: string
  hint?: string
}


const Item = ({ icon, title, hint }: ItemProps) => (
  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
    {icon}
    <span style={{ flex: 1 }}>
      {title}
    </span>
    <small>{hint ? `(${hint})` : ''}</small>
  </span>
)


class MenuBar extends React.Component<Actions> {
  handleClick({ key }: ClickEvent) {
    const {
      onInitialize,
      onDeleteSelection,
      onExecute,
      onCopy,
      onCut,
      onPaste,
      onUndo,
      onRedo,
      onToggleWorkflow,
    } = this.props
    switch (key) {
      case NEW_FILE_ACTION: {
        onInitialize()
        break
      }
      case UNDO_ACTION: {
        onUndo()
        break
      }
      case REDO_ACTION: {
        onRedo()
        break
      }
      case RUN_ACTION: {
        onExecute()
        break
      }
      case COPY_ACTION: {
        onCopy()
        break
      }
      case CUT_ACTION: {
        onCut()
        break
      }
      case PASTE_ACTION: {
        onPaste()
        break
      }
      case DELETE_ACTION: {
        onDeleteSelection()
        break
      }
      case TOGGLE_WORKFLOW_ACTION: {
        onToggleWorkflow()
        break
      }
    }
  }

  render() {
    return (
      <Menu onClick={(ev) => this.handleClick(ev)} mode="horizontal">
        <SubMenu title="File">
          <Menu.Item key={NEW_FILE_ACTION}>
            <Item icon={<FileOutlined />} title="New..." />
          </Menu.Item>
          <Menu.Item key={SAVE_FILE_ACTION}>Save</Menu.Item>
          <Menu.Item key={SAVE_FILE_AS_ACTION}>Save as...</Menu.Item>
          <Divider style={{ margin: 0 }} />
          <Menu.Item key={SHOW_PREFS_ACTION}>
            <Item icon={<SettingOutlined />} title="Preferences..." />
          </Menu.Item>
        </SubMenu>
        <SubMenu title="Edit">
          <Menu.Item key={UNDO_ACTION}>
            <Item icon={<UndoOutlined />} title="Undo" hint="Cmd+Z" />
          </Menu.Item>
          <Menu.Item key={REDO_ACTION}>
            <Item icon={<RedoOutlined />} title="Redo" hint="Cmd+Shft+Z" />
          </Menu.Item>
          <Divider style={{ margin: 0 }} />
          <Menu.Item key={COPY_ACTION}>
            <Item icon={<CopyOutlined />} title="Copy" hint="Cmd+C" />
          </Menu.Item>
          <Menu.Item key={CUT_ACTION}>
            <Item icon={<ScissorOutlined />} title="Cut" hint="Cmd+X" />
          </Menu.Item>
          <Menu.Item key={PASTE_ACTION}>
            <Item icon={<SnippetsOutlined />} title="Paste" hint="Cmd+V" />
          </Menu.Item>
          <Divider style={{ margin: 0 }} />
          <Menu.Item key={DELETE_ACTION}>
            <Item icon={<DeleteOutlined />} title="Delete" hint="Del" />
          </Menu.Item>
        </SubMenu>
        <SubMenu title="View">
          <Menu.Item key="zoomInAction">Zoom In</Menu.Item>
          <Menu.Item key="zoomOutAction">Zoom Out</Menu.Item>
          <Menu.Item key="resetZoomAction">Reset Zoom</Menu.Item>
          <Divider style={{ margin: 0 }} />
          <Menu.Item key={TOGGLE_WORKFLOW_ACTION}>
            <Item icon={<UpSquareOutlined />} title="Toggle Workflow" />
          </Menu.Item>
        </SubMenu>
        <SubMenu title="Run">
          <Menu.Item key={RUN_ACTION}>
            <Item icon={<PlayCircleFilled />} title="Run..." hint="Cmd+Enter" />
          </Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

const actions = {
  onDeleteSelection: deleteSelection,
  onExecute: executeBlueprint,
  onInitialize: initialize,
  onRedo: ActionCreators.redo,
  onCopy: copySelection,
  onCut: cutSelection,
  onPaste: pasteSelection,
  onToggleWorkflow: toggleWorkflow,
  onUndo: ActionCreators.undo,
}

export default connect(null, actions)(MenuBar)
