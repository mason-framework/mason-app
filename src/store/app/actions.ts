import {
  FILE_INITIALIZED,
  INITIALIZED,
  SET_LOCALE,
  AppAction,
} from 'store/app/types'

export const initialize = (): AppAction => ({
  type: INITIALIZED,
})

export const initializeFile = (): AppAction => ({
  type: FILE_INITIALIZED,
})

export const setLocale = (locale: string): AppAction => ({
  type: SET_LOCALE,
  locale,
})
