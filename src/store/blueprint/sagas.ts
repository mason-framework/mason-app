import { SagaIterator } from 'redux-saga'
import { put, takeEvery } from 'redux-saga/effects'
import { INITIALIZED, FILE_INITIALIZED } from 'store/app/types'
import { initializeBlueprint } from 'store/blueprint/actions'


function* initializeBlueprintSaga() {
  yield put(initializeBlueprint())
}


export function* blueprintSaga(): SagaIterator<void> {
  yield takeEvery([INITIALIZED, FILE_INITIALIZED], initializeBlueprintSaga)
}
