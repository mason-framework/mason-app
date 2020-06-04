import { eventChannel } from 'redux-saga'
import {
  put,
  call,
  take,
  takeEvery,
  select,
} from 'redux-saga/effects'
import { CONFIG_CHANGED, INITIALIZED } from 'store/app/types'
import { LOGS_TOGGLED } from 'store/logs/types'
import { getConfig } from 'store/app/selectors'
import { addLog, disableLogs, toggleLogs } from 'store/logs/actions'
import { getEnabled } from 'store/logs/selectors'

function createEventChannel(host: string) {
  const url = new URL(host)
  if (url.protocol === 'https:') {
    url.protocol = 'wss:'
  } else {
    url.protocol = 'ws:'
  }
  const sock = new WebSocket(`${url.toString()}streams/log`)
  return eventChannel((emit) => {
    sock.onerror = () => emit(disableLogs())
    sock.onclose = () => emit(disableLogs())
    sock.onmessage = (message) => emit(addLog(message.data))
    return () => sock.close()
  })
}

function* initConnection() {
  const { apiHost } = yield select(getConfig)
  const channel = yield call(createEventChannel, apiHost)
  let enabled = yield select(getEnabled)
  while (enabled) {
    const action = yield take(channel)
    yield put(action)
    enabled = yield select(getEnabled)
  }
}

function* resetConnection() {
  const enabled = yield select(getEnabled)
  if (enabled) {
    yield put(toggleLogs())
    yield put(toggleLogs())
  }
}

export function* logsSaga() {
  yield takeEvery([INITIALIZED, LOGS_TOGGLED], initConnection)
  yield takeEvery(CONFIG_CHANGED, resetConnection)
}
