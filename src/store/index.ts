import { combineReducers, createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import { appReducer } from 'store/app/reducers'
import { blueprintReducer } from 'store/blueprint/reducers'
import { blueprintSaga } from 'store/blueprint/sagas'
import { graphReducer } from 'store/graph/reducers'
import { graphSaga } from 'store/graph/sagas'
import { libraryReducer } from 'store/library/reducers'
import { librarySaga } from 'store/library/sagas'

const reducers = combineReducers({
  app: appReducer,
  blueprint: blueprintReducer,
  graph: graphReducer,
  library: libraryReducer,
})

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
)

sagaMiddleware.run(librarySaga)
sagaMiddleware.run(blueprintSaga)
sagaMiddleware.run(graphSaga)

export default store
