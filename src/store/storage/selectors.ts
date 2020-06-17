import _reduce from 'lodash/reduce'
import { createSelector } from 'reselect'
import { StorageItem } from 'store/storage/types'
import { ReduxState } from 'store/types'


export const getItems = ({ storage }: ReduxState): Array<StorageItem> => storage.items
export const getIsModalVisible = ({ storage }: ReduxState): boolean => storage.modalVisible
export const getMode = ({ storage }: ReduxState): string => storage.mode

export const getItemMap = createSelector(
  getItems,
  (items): Record<string, StorageItem> => _reduce(
    items,
    (acc: Record<string, StorageItem>, item: StorageItem): Record<string, StorageItem> => {
      const key = item.path ? `${item.path}/${item.name}` : item.name
      acc[key] = item
      return acc
    },
    {},
  ),
)
