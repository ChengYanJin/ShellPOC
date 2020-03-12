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
import { subspace } from 'redux-subspace';

const MetalMicroApp = React.lazy(() => import('metalk8s/Node'));
//const Toto = React.lazy(() => import('websiteZenko/TotoContainer'));
const MetalReducer = () =>
  import('metalk8s/reducer').then(res => console.log('res', res));

console.log('MetalReducer', MetalReducer);

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
  const userManager = useSelector(
    state => appNamespaceSelector(state).config.userManager,
  );

  const subStore = subspace(state => state.metalk8s, 'metalk8s')(store);

  console.log('subStore', subStore);

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
          <div>Placeholder for Metalk8s</div>
          <Suspense fallback={<div>Loading Zenko...</div>}>
            <MetalMicroApp />
          </Suspense>
        </Route>
        <Route
          path="/oauth2/callback"
          component={() => {
            return <CallbackPage userManager={userManager} />;
          }}
        />
        <Route path="/">
          <DefaultApp />
          <button onClick={() => dispatch({ type: 'FETCH_YANJIN' })}>
            dispatch FETCH_YANJIN
          </button>
          <button onClick={() => dispatch({ type: 'FETCH_PATRICK' })}>
            dispatch FETCH_PATRICK
          </button>
        </Route>
      </Switch>
    </>
  );
};

export default App;
