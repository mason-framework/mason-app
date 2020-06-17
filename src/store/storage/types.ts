export const STORAGE_MODAL_OPEN = '@@storage/MODAL_OPEN'
export const STORAGE_MODAL_SAVE = '@@storage/MODAL_SAVE'
export const STORAGE_MODAL_CLOSED = '@@storage/MODAL_CLOSED'
export const STORAGE_LOADED = '@@storage/LOADED'
export const BLUEPRINT_OPENED = '@@storage/BLUEPRINT_OPENED'
export const BLUEPRINT_SAVED = '@@storage/BLUEPRINT_SAVED'

export interface StorageItem {
  path: string
  name: string
  type: string
}

interface OpenStorageModalAction {
  type: typeof STORAGE_MODAL_OPEN
}

interface SaveStorageModalAction {
  type: typeof STORAGE_MODAL_SAVE
}

export interface OpenBlueprintAction {
  type: typeof BLUEPRINT_OPENED
  path: string
}

export interface SaveBlueprintAction {
  type: typeof BLUEPRINT_SAVED
  path: string
}

interface CloseStorageModalAction {
  type: typeof STORAGE_MODAL_CLOSED
}

interface LoadStorageAction {
  type: typeof STORAGE_LOADED
  items: Array<StorageItem>
}

export type StorageAction =
  CloseStorageModalAction |
  OpenBlueprintAction |
  OpenStorageModalAction |
  LoadStorageAction |
  SaveBlueprintAction |
  SaveStorageModalAction

export interface StorageState {
  modalVisible: boolean
  mode: string
  items: Array<StorageItem>
}
