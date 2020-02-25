import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom';
import { corsImport, ExternalComponent } from 'webpack-external-import';

import { Navbar } from '@scality/core-ui';

const DefaultApp = () => {
  return <div>Hello World in Shell ! :D</div>;
};

const App = () => {
  const history = useHistory();
  const tabs = [
    {
      selected: false,
      title: 'metalK8s',
      onClick: () => history.push('/metalk8s'),
    },
    {
      selected: false,
      title: 'Zenko',
      onClick: () => console.log('zenko'),
    },
  ];

  return (
    <>
      <Navbar productName={'ShellPOC'} tabs={tabs} />
      <Switch>
        <Route
          // exact
          path="/metalk8s"
          component={() => (
            <ExternalComponent
              interleave={__webpack_require__.interleaved(
                'metalK8s/MetalMicroApp',
              )}
            />
          )}
        ></Route>
        <Route path="/">
          <DefaultApp />
        </Route>
      </Switch>
    </>
  );
};

const configMap = [
  {
    name: 'metalk8s',
    version: '2.4.2',
    // we need to give the absolute path to fetch the importManifest
    path: '/external-manifest/metalk8s/importManifest.js',
  },
];

Promise.all(
  configMap
    .map(solution => solution.path)
    .map(path => corsImport(`${path}?${Date.now()}`)),
).then(() =>
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root'),
  ),
);
