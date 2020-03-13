import React, { useEffect, Suspense } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  appNamespaceSelector,
  setSelectorNamespace,
} from './ducks/namespaceHelper';
import { call, put, takeLatest } from 'redux-saga/effects';
import CallbackPage from './loginCallback';
import { loadUser, createUserManager } from 'redux-oidc';
import { WebStorageStateStore } from 'oidc-client';
import { SubspaceProvider } from 'react-redux-subspace';

const MetalOwner = React.lazy(() => import('metalk8s/metalk8sOwner'));
//const Toto = React.lazy(() => import('websiteZenko/TotoContainer'));

const DefaultApp = () => {
  return <div>Hello World in Shell ! :D</div>;
};

const App = props => {
  const { store, namespace } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  setSelectorNamespace(namespace);
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

  // Get the state
  // const userManager = useSelector(
  //   state => appNamespaceSelector(state).config.userManager,
  // );

  return (
    <>
      {/* <Navbar productName={'ShellPOC'} tabs={tabs} /> */}
      <div>
        {tabs.map((tab, idx) => (
          <button key={idx} onClick={tab.onClick}>
            {tab.title}
          </button>
        ))}
      </div>
      <Switch>
        <Route path="/metalk8s">
          <SubspaceProvider
            mapState={state => state.metalk8s}
            namespace="metalk8s"
          >
            <Suspense fallback={<div>Loading Metalk8s...</div>}>
              <MetalOwner />
            </Suspense>
          </SubspaceProvider>
        </Route>
        {/* <Route
          path="/oauth2/callback"
          component={() => {
            return <CallbackPage userManager={userManager} />;
          }}
        /> */}
        <Route path="/">
          <SubspaceProvider mapState={state => state.shell} namespace="shell">
            <div>
              <DefaultApp />
              <button onClick={() => dispatch({ type: 'FETCH_YANJIN' })}>
                dispatch FETCH_YANJIN
              </button>
              <button onClick={() => dispatch({ type: 'FETCH_PATRICK' })}>
                dispatch FETCH_PATRICK
              </button>
            </div>
          </SubspaceProvider>
        </Route>
      </Switch>
    </>
  );
};

export default App;
