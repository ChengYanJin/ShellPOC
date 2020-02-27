import { createStore, combineReducers } from 'redux';

const configureStore = () => {
  const staticReducer = {};
  const initialReducer = state => state;
  const store = createStore(
    initialReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
  );

  const createReducer = asyncReducers => {
    return combineReducers({
      staticReducer,
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

  return store;
};

export { configureStore };
