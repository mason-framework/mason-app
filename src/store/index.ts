import { combineReducers, createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import { appReducer } from 'store/app/reducers'
import { graphReducer } from 'store/graph/reducers'
import { graphSaga } from 'store/graph/sagas'
import { serverReducer } from 'store/server/reducers'
import { serverSaga } from 'store/server/sagas'
import { treeReducer } from 'store/tree/reducers'


const reducers = combineReducers({
  app: appReducer,
  graph: graphReducer,
  server: serverReducer,
  tree: treeReducer,
})

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
)

sagaMiddleware.run(serverSaga)
sagaMiddleware.run(graphSaga)

export default store
