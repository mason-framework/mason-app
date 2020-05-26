import { INITIALIZED, SET_LOCALE, AppAction } from 'store/app/types'

export const initialize = (): AppAction => ({
  type: INITIALIZED,
})

export const setLocale = (locale: string): AppAction => ({
  type: SET_LOCALE,
  locale,
})
