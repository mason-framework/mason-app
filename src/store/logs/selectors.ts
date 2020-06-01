import { ReduxState } from 'store/types'

export const getLogs = ({ logs }: ReduxState): Array<string> => logs.logs
export const getLevel = ({ logs }: ReduxState): string => logs.level
