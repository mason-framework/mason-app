import { call, put, takeEvery } from 'redux-saga/effects'
import { loadLibrary } from 'store/library/actions'
import { INITIALIZED } from 'store/app/types'
import { Library } from 'store/library/types'
import * as api from 'store/library/api'

const BASE_URL = 'http://localhost:8000'

function* loadLibrarySaga(): Generator {
  const library = yield call(api.getLibrary, BASE_URL)
  yield put(loadLibrary(library as Library))
}

export function* librarySaga(): Generator {
  yield takeEvery(INITIALIZED, loadLibrarySaga)
}
