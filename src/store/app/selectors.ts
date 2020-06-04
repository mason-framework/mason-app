import { createSelector } from 'reselect'

import { ReduxState } from 'store/types'
import {
  MESSAGE_CATALOG,
  Config,
} from 'store/app/types'

export const getConfig = ({ app }: ReduxState): Config => app.config
export const getConfigVisible = ({ app }: ReduxState): boolean => app.configVisible

export const getLocale = ({ app }: ReduxState): string => app.config.locale
export const getMessages = createSelector(
  getLocale, (locale: string): Record<string, string> => ({
    ...MESSAGE_CATALOG['en-us'],
    ...MESSAGE_CATALOG[locale],
  }),
)

export const getApiHost = ({ app }: ReduxState): string => app.config.apiHost
export const getApiToken = ({ app }: ReduxState): string => app.config.apiToken
export const getTheme = ({ app }: ReduxState): string => app.config.theme

export const getWorkflowTab = ({ app }: ReduxState): string => app.workflowTab
export const getWorkflowVisible = ({ app }: ReduxState): boolean => app.workflowVisible
