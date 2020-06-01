import { createSelector } from 'reselect'

import { ReduxState } from 'store/types'
import { LOCALE_DEFAULT, LOCALE_EN_US } from 'store/app/types'
import enUS from 'translations/en-us.json'

const MESSAGE_CATALOG: Record<string, Record<string, string>> = {
  [LOCALE_EN_US]: enUS,
}

export const getLocale = ({ app }: ReduxState): string => app.locale
export const getLocales = (): Array<string> => [LOCALE_EN_US]
export const getMessages = createSelector(
  getLocale, (locale: string): Record<string, string> => ({
    ...MESSAGE_CATALOG[LOCALE_DEFAULT],
    ...MESSAGE_CATALOG[locale],
  }),
)

export const getWorkflowVisible = ({ app }: ReduxState): boolean => app.workflowVisible
