import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, compose } from 'redux';
import { namespaced, subspace } from 'redux-subspace';
import { SubspaceProvider } from 'react-redux-subspace';
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
import importExternalLibrary from './importExternalLibrary';

const configMap = [
  {
    name: 'metalk8s',
    version: '2.4.2',
    // we need to give the absolute path to fetch the remote
    path: '/external-component/metalk8s/remoteEntry.js',
  },
  // {
  //   name: 'zenko',
  //   version: '2.4.2',
  //   // we need to give the absolute path to fetch the remote
  //   path: '/external-component/zenko/remoteEntry.js',
  // },
];

// const store = configureStore();
// const namespace = 'shell';
// setActionCreatorNamespace(namespace);
// setSelectorNamespace(namespace);

// store.dispatch(nameSpaceAction(createUserManagerAction));
// const userManager = store.getState()[namespace].config.userManager;
// loadUser(store, userManager);
// const shellStore = subspace(state => state.shell)(store);
let store = undefined;

const RootApp = () => {
  const [isStoreReady, setIsStoreReady] = useState(false);
  useEffect(() => {
    import('metalk8s/reducer').then(res => {
      const metalk8sReducer = res.default;
      const reducer = combineReducers({
        metalk8s: namespaced('metalk8s')(metalk8sReducer),
        shell: namespaced('shell')(rootReducer),
      });
      const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // to debug in the browser
      store = createStore(reducer, composeEnhancers());
      setIsStoreReady(true);
    });
  }, []);

  return isStoreReady ? (
    <Provider store={store}>
      {/* <OidcProvider store={store} userManager={userManager}> */}
      <BrowserRouter>
        <App store={store} namespace="shell" />
      </BrowserRouter>
      {/* </OidcProvider> */}
    </Provider>
  ) : // FIXME Should be a loading page
  null;
};

Promise.all(
  configMap
    .map(solution => solution.path)
    .map(path => importExternalLibrary(`${path}?${Date.now()}`)),
).then(() => ReactDOM.render(<RootApp />, document.getElementById('root')));
