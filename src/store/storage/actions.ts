import {
  STORAGE_MODAL_OPEN,
  STORAGE_MODAL_CLOSED,
  STORAGE_MODAL_SAVE,
  STORAGE_LOADED,
  BLUEPRINT_SAVED,
  BLUEPRINT_OPENED,
  StorageAction,
  StorageItem,
} from 'store/storage/types'

export const closeStorageModal = (): StorageAction => ({
  type: STORAGE_MODAL_CLOSED,
})

export const openStorageModal = (): StorageAction => ({
  type: STORAGE_MODAL_OPEN,
})

export const openBlueprint = (path: string): StorageAction => ({
  type: BLUEPRINT_OPENED,
  path,
})

export const saveBlueprint = (path: string): StorageAction => ({
  type: BLUEPRINT_SAVED,
  path,
})

export const saveStorageModal = (): StorageAction => ({
  type: STORAGE_MODAL_SAVE,
})

export const loadStorage = (items: Array<StorageItem>): StorageAction => ({
  type: STORAGE_LOADED,
  items,
})
