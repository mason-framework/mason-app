import { SagaIterator } from 'redux-saga'
import {
  all,
  put,
  takeEvery,
} from 'redux-saga/effects'
import { INITIALIZED as APP_INITIALIZED } from 'store/app/types'
import { initialize } from 'store/blueprint/actions'


function* initializeBlueprintSaga() {
  yield put(initialize())
}

export function* blueprintSaga(): SagaIterator<void> {
  yield all([
    takeEvery(APP_INITIALIZED, initializeBlueprintSaga),
  ])
}
