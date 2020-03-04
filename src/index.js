import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { corsImport } from 'webpack-external-import';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';
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

store.injectReducer(
  `${namespace}`,
  namespaceReducerFactory(namespace, rootReducer),
);

store.dispatch(nameSpaceAction(createUserManagerAction));
const userManager = store.getState()[namespace].config.userManager;

Promise.all(
  configMap
    .map(solution => solution.path)
    .map(path => corsImport(`${path}?${Date.now()}`)),
).then(() =>
  ReactDOM.render(
    <Provider store={store}>
      <OidcProvider store={store} userManager={userManager}>
        <BrowserRouter>
          <App store={store} namespace="shell" />
        </BrowserRouter>
      </OidcProvider>
    </Provider>,
    document.getElementById('root'),
  ),
);
