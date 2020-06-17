import { combineReducers, createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import undoable from 'redux-undo'

import { appReducer } from 'store/app/reducers'
import { blueprintReducer } from 'store/blueprint/reducers'
import { blueprintSaga } from 'store/blueprint/sagas'
import { storageReducer } from 'store/storage/reducers'
import { storageSaga } from 'store/storage/sagas'
import { graphReducer } from 'store/graph/reducers'
import { graphSaga } from 'store/graph/sagas'
import { libraryReducer } from 'store/library/reducers'
import { librarySaga } from 'store/library/sagas'
import { logsReducer } from 'store/logs/reducers'
import { logsSaga } from 'store/logs/sagas'
import { profileReducer } from 'store/profile/reducers'
import { profileSaga } from 'store/profile/sagas'
import { runsReducer } from 'store/runs/reducers'
import { runsSaga } from 'store/runs/sagas'
import { selectionReducer } from 'store/selection/reducers'
import { selectionSaga } from 'store/selection/sagas'

const reducers = combineReducers({
  app: appReducer,
  blueprint: undoable(blueprintReducer),
  storage: storageReducer,
  graph: graphReducer,
  library: libraryReducer,
  logs: logsReducer,
  profile: profileReducer,
  selection: selectionReducer,
  runs: runsReducer,
})

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
)

sagaMiddleware.run(librarySaga)
sagaMiddleware.run(logsSaga)
sagaMiddleware.run(storageSaga)
sagaMiddleware.run(profileSaga)
sagaMiddleware.run(runsSaga)
sagaMiddleware.run(blueprintSaga)
sagaMiddleware.run(graphSaga)
sagaMiddleware.run(selectionSaga)

export default store
