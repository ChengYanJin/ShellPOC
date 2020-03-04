import { reducer as oidcReducer } from 'redux-oidc';
import { combineReducers } from 'redux';
import configReducer from './config';

const rootReducer = combineReducers({
  config: configReducer,
  oidc: oidcReducer,
});

export default rootReducer;
