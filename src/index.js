import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { corsImport } from 'webpack-external-import';
import { Provider } from 'react-redux';
import { OidcProvider, loadUser } from 'redux-oidc';
import {
  nameSpaceAction,
  setActionCreatorNamespace,
  namespaceReducerFactory,
  setSelectorNamespace,
} from './ducks/namespaceHelper';
import { createUserManagerAction } from './ducks/config';
import { configureStore } from './ducks/configureStore';
import App from './App';
import rootReducer from './ducks/reducer';
import { namespaced, subspace } from 'redux-subspace';
import { SubspaceProvider } from 'react-redux-subspace';

const configMap = [
  {
    name: 'metalk8s',
    version: '2.4.2',
    // we need to give the absolute path to fetch the importManifest
    path: '/external-manifest/metalk8s/importManifest.js',
  },
];

const store = configureStore();
const namespace = 'shell';
setActionCreatorNamespace(namespace);
setSelectorNamespace(namespace);

store.injectReducer(`${namespace}`, namespaced(`${namespace}`)(rootReducer));
console.log('shell store', store);

// store.dispatch(nameSpaceAction(createUserManagerAction));
// const userManager = store.getState()[namespace].config.userManager;
// loadUser(store, userManager);
// const shellStore = subspace(state => state.shell)(store);

Promise.all(
  configMap
    .map(solution => solution.path)
    .map(path => corsImport(`${path}?${Date.now()}`)),
).then(() =>
  ReactDOM.render(
    <Provider store={store}>
      {/* <OidcProvider store={store} userManager={userManager}> */}
      <BrowserRouter>
        <App store={store} namespace="shell" />
      </BrowserRouter>
      {/* </OidcProvider> */}
    </Provider>,
    document.getElementById('root'),
  ),
);
