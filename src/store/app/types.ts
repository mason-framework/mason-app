export const INITIALIZED = '@@app/INITIALIZED'
export const SET_LOCALE = '@@app/SET_LOCALE'

export const FILE_INITIALIZED = '@@app/FILE_INITIALIZED'

export const LOCALE_EN_US = 'en-us'
export const LOCALE_DEFAULT = LOCALE_EN_US

export interface InitializeAction {
  type: typeof INITIALIZED
}

export interface InitializeFileAction {
  type: typeof FILE_INITIALIZED
}

export interface SetLocaleAction {
  type: typeof SET_LOCALE
  locale: string
}

export type AppAction =
  InitializeAction |
  InitializeFileAction |
  SetLocaleAction

export interface AppState {
  locale: string
}
