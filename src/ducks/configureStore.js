// cf. https://github.com/redux-saga/redux-saga/issues/280
import 'regenerator-runtime/runtime';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
// import { call, put, takeLatest } from 'redux-saga/effects';
import shell from './reducer';
import { namespaced } from 'redux-subspace';
// Shell
const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    shell,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );

  const createReducer = asyncReducers => {
    return combineReducers({
      shell,
      ...asyncReducers,
    });
  };

  // Add a dictionary to keep track of the registered async reducers
  store.asyncReducers = {};
  // Create an inject reducer function
  // This function adds the async reducer, and creates a new combined reducer
  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = namespaced(key)(asyncReducer);
    store.replaceReducer(createReducer(store.asyncReducers));
  };

  store.runSaga = sagaMiddleware.run;

  return store;
};

export { configureStore };
