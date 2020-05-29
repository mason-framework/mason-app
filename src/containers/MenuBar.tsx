import React from 'react'
import { Menu, Divider, Typography } from 'antd'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'

import { initialize } from 'store/blueprint/actions'
import { deleteSelection } from 'store/selection/actions'

const { Text } = Typography
const { SubMenu } = Menu

const TITLE_STYLE = {
  paddingLeft: 24,
  paddingRight: 12,
  letterSpacing: 6,
}


interface Actions {
  onInitialize(): void
  onDeleteSelection(): void
  onUndo(): void
  onRedo(): void
}

interface ClickEvent {
  key: string
}

const NEW_FILE_ACTION = 'NEW_FILE_ACTION'
const SAVE_FILE_ACTION = 'SAVE_FILE_ACTION'
const SAVE_FILE_AS_ACTION = 'SAVE_FILE_AS_ACTION'
const SHOW_PREFS_ACTION = 'SHOW_PREFS_ACTION'
const UNDO_ACTION = 'UNDO_ACTION'
const REDO_ACTION = 'REDO_ACTION'
const DELETE_ACTION = 'DELETE_ACTION'


class MenuBar extends React.Component<Actions> {
  handleClick({ key }: ClickEvent) {
    const {
      onInitialize,
      onDeleteSelection,
      onUndo,
      onRedo,
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
      case DELETE_ACTION: {
        onDeleteSelection()
        break
      }
    }
  }

  render() {
    return (
      <Menu onClick={(ev) => this.handleClick(ev)} mode="horizontal">
        <Text style={TITLE_STYLE}><strong>MASON</strong></Text>
        <SubMenu title="File">
          <Menu.Item key={NEW_FILE_ACTION}>New...</Menu.Item>
          <Menu.Item key={SAVE_FILE_ACTION}>Save</Menu.Item>
          <Menu.Item key={SAVE_FILE_AS_ACTION}>Save as...</Menu.Item>
          <Divider style={{ margin: 0 }} />
          <Menu.Item key={SHOW_PREFS_ACTION}>Preferences...</Menu.Item>
        </SubMenu>
        <SubMenu title="Edit">
          <Menu.Item key={UNDO_ACTION}>Undo</Menu.Item>
          <Menu.Item key={REDO_ACTION}>Redo</Menu.Item>
          <Divider style={{ margin: 0 }} />
          <Menu.Item key="copyAction">Copy</Menu.Item>
          <Menu.Item key="cutAction">Cut</Menu.Item>
          <Menu.Item key="pasteAction">Paste</Menu.Item>
          <Divider style={{ margin: 0 }} />
          <Menu.Item key={DELETE_ACTION}>Delete</Menu.Item>
        </SubMenu>
        <SubMenu title="Run">
          <Menu.Item key="runAction">Run...</Menu.Item>
        </SubMenu>
        <SubMenu title="View">
          <Menu.Item key="zoomInAction">Zoom In</Menu.Item>
          <Menu.Item key="zoomOutAction">Zoom Out</Menu.Item>
          <Menu.Item key="resetZoomAction">Reset Zoom</Menu.Item>
          <Divider style={{ margin: 0 }} />
          <Menu.Item key="toggleWorkflowAction">Toggle Workflow Panel</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

const actions = {
  onInitialize: initialize,
  onDeleteSelection: deleteSelection,
  onUndo: ActionCreators.undo,
  onRedo: ActionCreators.redo,
}

export default connect(null, actions)(MenuBar)
