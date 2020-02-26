import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom';
import { corsImport, ExternalComponent } from 'webpack-external-import';
import { Provider, useSelector } from 'react-redux';

import { configureStore } from './ducks/reducers';
import App from './App';

const configMap = [
  {
    name: 'metalk8s',
    version: '2.4.2',
    // we need to give the absolute path to fetch the importManifest
    path: '/external-manifest/metalk8s/importManifest.js',
  },
];

const store = configureStore();

Promise.all(
  configMap
    .map(solution => solution.path)
    .map(path => corsImport(`${path}?${Date.now()}`)),
).then(() =>
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App store={store} />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root'),
  ),
);
