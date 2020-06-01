import {
  SELECTION_ADDED,
  SELECTION_COPY_CLEARED,
  SELECTION_COPIED,
  SELECTION_CUT,
  SELECTION_PASTED,
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

export const copySelection = (): SelectionAction => ({
  type: SELECTION_COPIED,
})

export const cutSelection = (): SelectionAction => ({
  type: SELECTION_CUT,
})

export const pasteSelection = (): SelectionAction => ({
  type: SELECTION_PASTED,
})

export const clearCopy = (): SelectionAction => ({
  type: SELECTION_COPY_CLEARED,
})
