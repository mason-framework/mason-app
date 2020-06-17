import {
  STORAGE_MODAL_CLOSED,
  STORAGE_MODAL_OPEN,
  STORAGE_MODAL_SAVE,
  STORAGE_LOADED,
  StorageAction,
  StorageState,
} from 'store/storage/types'

const initialState: StorageState = {
  mode: 'open',
  modalVisible: false,
  items: [],
}

export function storageReducer(
  state = initialState,
  action: StorageAction,
): StorageState {
  switch (action.type) {
    case STORAGE_MODAL_OPEN: {
      return { ...state, modalVisible: true, mode: 'open' }
    }
    case STORAGE_MODAL_SAVE: {
      return { ...state, modalVisible: true, mode: 'save' }
    }
    case STORAGE_MODAL_CLOSED: {
      return { ...state, modalVisible: false }
    }
    case STORAGE_LOADED: {
      const { items } = action
      return { ...state, items }
    }
    default:
      return state
  }
}
