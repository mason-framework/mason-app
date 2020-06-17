import _values from 'lodash/values'

import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { Button, Modal, Input } from 'antd'
import { StorageItem } from 'store/storage/types'
import {
  FileOutlined,
  FolderFilled,
  FolderOpenFilled,
} from '@ant-design/icons'

import {
  getItemMap,
  getMode,
} from 'store/storage/selectors'
import {
  closeStorageModal,
  openBlueprint,
  saveBlueprint,
} from 'store/storage/actions'
import { ReduxState } from 'store/types'

interface Props {
  storageItems: Record<string, StorageItem>
  mode: string
}

interface Actions {
  onOpen(path: string): void
  onSave(path: string): void
  onClose(): void
}

interface State {
  editing: string
  editingName: string
  customItems: Record<string, StorageItem>
  saveName: string
  selection: Record<number, string>
}


class StorageModal extends React.Component<Props & Actions, State> {
  constructor(props: Props & Actions) {
    super(props)
    this.state = {
      saveName: '',
      editing: '',
      editingName: '',
      customItems: {},
      selection: {},
    }
  }

  getLevels(): Array<Array<StorageItem>> {
    const { storageItems } = this.props
    const { customItems, selection } = this.state
    const itemMap = { ...storageItems, ...customItems }
    const items = _values(itemMap)
    const levels: Array<Array<StorageItem>> = []
    let parent = ''
    let index = 0
    while (parent || !index) {
      const level: Array<StorageItem> = []
      for (const item of items) {
        if (item.path === parent) {
          level.push(item)
        }
      }
      levels.push(level)
      parent = selection[index]
      if (parent && itemMap[parent].type !== 'group') {
        break
      }
      index += 1
    }
    return levels
  }

  addGroup() {
    const { selection, customItems } = this.state
    const { storageItems } = this.props
    let top = ''
    let index = 0
    while (selection[index]) {
      top = selection[index]
      index += 1
    }
    const item = storageItems[top] || customItems[top]
    if (!top || (item && item.type === 'group')) {
      const name = 'New Group'
      const itemPath = top ? `${top}/${name}` : name
      this.setState((prevState) => ({
        ...prevState,
        editing: itemPath,
        editingName: name,
        customItems: {
          ...prevState.customItems,
          [itemPath]: {
            path: top,
            name,
            type: 'group',
          },
        },
      }))
    }
  }

  toggleSelect(path: string, level: number) {
    this.setState((prevState) => {
      const { selection: old } = prevState
      const selection = {
        ...old,
        [level]: old[level] === path ? '' : path,
      }
      let curr = level + 1
      while (selection[curr]) {
        selection[curr] = ''
        curr += 1
      }
      return {
        ...prevState,
        selection,
      }
    })
  }

  changeEditingName(name: string) {
    this.setState({ editingName: name })
  }

  changeSaveName(name: string) {
    this.setState({ saveName: name })
  }

  commitEdits() {
    const { editing, editingName, customItems } = this.state
    const item = customItems[editing]
    if (item && item.type === 'group') {
      delete customItems[editing]
      const itemPath = item.path ? `${item.path}/${editingName}` : editingName
      this.setState((prevState) => ({
        ...prevState,
        editing: '',
        editingName: '',
        customItems: {
          ...customItems,
          [itemPath]: {
            ...item,
            name: editingName,
          },
        },
      }))
    } else {
      this.setState({ editing: '', editingName: '' })
    }
  }

  currentItem(): StorageItem | undefined {
    const { selection, customItems } = this.state
    const { storageItems } = this.props
    let top = ''
    let index = 0
    while (selection[index]) {
      top = selection[index]
      index += 1
    }
    return storageItems[top] || customItems[top]
  }

  render() {
    const {
      editing,
      editingName,
      selection,
      saveName,
    } = this.state
    const levels = this.getLevels()
    const {
      onOpen,
      onClose,
      onSave,
      mode,
    } = this.props
    const currItem = this.currentItem()
    const buttonProps = { disabled: true }
    let currPath
    let currName
    if (currItem) {
      currPath = currItem.type === 'group' ? `${currItem.path}/${currItem.name}` : currItem.path
      currName = currItem.type === 'blueprint' ? currItem.name : saveName
      if (currPath[0] === '/') {
        currPath = currPath.slice(1)
      }
    } else {
      currPath = ''
      currName = saveName
    }

    const currKey = currPath ? `${currPath}/${currName}` : currName

    if (mode === 'open') {
      buttonProps.disabled = !(currItem && currItem.type === 'blueprint')
    } else {
      buttonProps.disabled = !(saveName || (currItem && currItem.type === 'blueprint'))
    }

    return (
      <Modal
        okText={mode === 'open' ? 'Open' : 'Save'}
        cancelText="Cancel"
        onCancel={onClose}
        onOk={() => (mode === 'save' ? onSave(currKey) : onOpen(currKey))}
        title={mode === 'open' ? 'Open Blueprint' : 'Save Blueprint'}
        visible
        bodyStyle={{ padding: 8 }}
        okButtonProps={buttonProps}
      >
        {mode === 'save' && (
          <Input
            placeholder="Save as..."
            onChange={(ev) => this.changeSaveName(ev.target.value)}
            onPressEnter={() => onSave(currKey)}
            value={currItem && currItem.type === 'blueprint' ? currItem.name : saveName}
            disabled={currItem && currItem.type === 'blueprint'}
          />
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            overflow: 'auto',
            height: 200,
            marginTop: mode === 'save' ? 4 : 0,
          }}
        >
          {levels.map((items, levelIndex) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 150,
                minWidth: 150,
                border: '2px groove #3a3a3a',
                background: '#1a1a1a',
                overflowY: 'auto',
                marginRight: 4,
              }}
            >
              {items.map((item) => {
                const key = item.path ? `${item.path}/${item.name}` : item.name
                const selected = selection[levelIndex] === key
                let icon: React.ReactNode
                const isGroup = item.type === 'group'
                if (isGroup && selected) {
                  icon = <FolderOpenFilled />
                } else if (isGroup) {
                  icon = <FolderFilled />
                } else {
                  icon = <FileOutlined />
                }

                if (editing === key) {
                  return (
                    <Input
                      key={key}
                      size="small"
                      onPressEnter={() => this.commitEdits()}
                      onChange={(ev) => this.changeEditingName(ev.target.value)}
                      value={editingName}
                      autoFocus
                    />
                  )
                }
                return (
                  <Button
                    key={key}
                    icon={icon}
                    type={selected ? 'primary' : 'link'}
                    onClick={() => this.toggleSelect(key, levelIndex)}
                    size="small"
                    ghost={!selected}
                    block
                    style={{ textAlign: 'left' }}
                  >
                    {item.name}
                  </Button>
                )
              })}
            </div>
          ))}
        </div>
        {mode === 'save' && (
          <Button
            style={{ marginTop: 8 }}
            onClick={() => this.addGroup()}
          >
            New Group
          </Button>
        )}
      </Modal>
    )
  }
}

const selector = createStructuredSelector<ReduxState, Props>({
  mode: getMode,
  storageItems: getItemMap,
})

const actions = {
  onClose: closeStorageModal,
  onSave: saveBlueprint,
  onOpen: openBlueprint,
}

export default connect(selector, actions)(StorageModal)
