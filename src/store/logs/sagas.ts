import { eventChannel } from 'redux-saga'
import {
  put,
  call,
  take,
  takeEvery,
} from 'redux-saga/effects'
import { INITIALIZED } from 'store/app/types'
import { addLog } from 'store/logs/actions'

function createEventChannel() {
  const sock = new WebSocket('ws://localhost:8000/logs')
  return eventChannel((emit) => {
    sock.onmessage = (message) => emit(message.data)
    return () => {
      sock.close()
    }
  })
}

function* initConnection() {
  const channel = yield call(createEventChannel)
  while (true) {
    const log = yield take(channel)
    yield put(addLog(log))
  }
}

export function* logsSaga() {
  yield takeEvery(INITIALIZED, initConnection)
}
