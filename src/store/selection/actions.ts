import {
  SELECTION_ADDED,
  SELECTION_CLEARED,
  SELECTION_DELETED,
  SelectionAction,
} from 'store/selection/types'


export const addSelection = (uid: string): SelectionAction => ({
  type: SELECTION_ADDED,
  uid,
})

export const clearSelection = (): SelectionAction => ({
  type: SELECTION_CLEARED,
})

export const deleteSelection = (): SelectionAction => ({
  type: SELECTION_DELETED,
})
