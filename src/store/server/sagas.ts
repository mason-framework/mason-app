import { call, put, takeEvery } from 'redux-saga/effects'
import { libraryLoaded } from 'store/server/actions'
import { INITIALIZED } from 'store/app/types'
import { Library } from 'store/server/types'
import * as api from 'store/server/api'

const BASE_URL = 'http://localhost:8000'

function* loadLibrary(): Generator {
  const library = yield call(api.getLibrary, BASE_URL)
  yield put(libraryLoaded(library as Library))
}

export function* serverSaga(): Generator {
  yield takeEvery(INITIALIZED, loadLibrary)
}
