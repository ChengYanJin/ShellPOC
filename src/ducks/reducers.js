// cf. https://github.com/redux-saga/redux-saga/issues/280
import 'regenerator-runtime/runtime';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';

const logger = ({ getState, dispatch }) => {
  console.log('Inside Logger');
  return next => {
    console.log('next logger', next);
    return action => {
      console.log('inside action', action);
      return next(action);
    };
  };
};

const hahaLogger = ({ getState, dispatch }) => {
  console.log('Inside hahaLogger');
  return next => {
    console.log('next hahaLogger', next);
    return action => {
      console.log('inside hahaLogger action', action);
      return next(action);
    };
  };
};

const FETCH_PATRICK = 'FETCH_PATRICK';

export function* fetchPatrick() {
  console.log('fetchPatrick');
  yield;
}

export function* patrickSaga() {
  yield takeLatest(FETCH_PATRICK, fetchPatrick);
}

// Shell
const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
  const initialState = {};
  const initialReducer = (state = initialState) => state;

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    initialReducer,
    composeEnhancers(applyMiddleware(logger, hahaLogger, sagaMiddleware)),
  );

  // Metalk8s
  // Zenko
  sagaMiddleware.run(patrickSaga);

  const createReducer = asyncReducers => {
    return combineReducers({
      initialReducer,
      ...asyncReducers,
    });
  };

  // Add a dictionary to keep track of the registered async reducers
  store.asyncReducers = {};
  // Create an inject reducer function
  // This function adds the async reducer, and creates a new combined reducer
  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer(createReducer(store.asyncReducers));
  };

  store.runSaga = sagaMiddleware.run;

  return store;
};

export { configureStore };
