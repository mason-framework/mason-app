
export const SELECTION_ADDED = '@@graph/SELECTION_ADDED'
export const SELECTION_DELETED = '@@graph/SELECTION_DELETED'
export const SELECTION_CLEARED = '@@graph/SELECTION_CLEARED'

// Actions
interface AddSelectionAction {
  type: typeof SELECTION_ADDED
  uid: string
}

interface ClearSelectionAction {
  type: typeof SELECTION_CLEARED
}

interface DeleteSelectionAction {
  type: typeof SELECTION_DELETED
}

export type SelectionAction =
  AddSelectionAction |
  ClearSelectionAction |
  DeleteSelectionAction

// State
export interface SelectionState {
  selection: Array<string>
}
