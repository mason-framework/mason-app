
export const SELECTION_ADDED = '@@graph/SELECTION_ADDED'
export const SELECTION_COPIED = '@@graph/SELECTION_COPIED'
export const SELECTION_CUT = '@@graph/SELECTION_CUT'
export const SELECTION_PASTED = '@@graph/SELECTION_PASTED'
export const SELECTION_DELETED = '@@graph/SELECTION_DELETED'
export const SELECTION_CLEARED = '@@graph/SELECTION_CLEARED'
export const SELECTION_COPY_CLEARED = '@@graph/SELECTION_COPY_CLEARED'

// Actions
interface AddSelectionAction {
  type: typeof SELECTION_ADDED
  uid: string
}

interface CopySelectionAction {
  type: typeof SELECTION_COPIED
}

interface CutSelectionAction {
  type: typeof SELECTION_CUT
}

interface ClearSelectionAction {
  type: typeof SELECTION_CLEARED
}

interface ClearSelectionCopyAction {
  type: typeof SELECTION_COPY_CLEARED
}

interface DeleteSelectionAction {
  type: typeof SELECTION_DELETED
}

interface PasteSelectionAction {
  type: typeof SELECTION_PASTED
}

export type SelectionAction =
  AddSelectionAction |
  CopySelectionAction |
  ClearSelectionCopyAction |
  ClearSelectionAction |
  CutSelectionAction |
  DeleteSelectionAction |
  PasteSelectionAction

// State
export interface Copy {
  selection: Array<string>
  mode: string
}

export interface SelectionState {
  selection: Array<string>
  copy: Copy
}
