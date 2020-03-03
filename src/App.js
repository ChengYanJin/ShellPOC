import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { ExternalComponent } from 'webpack-external-import';
import { useDispatch } from 'react-redux';
import { Navbar } from '@scality/core-ui';
import {
  nameSpaceAction,
  setActionCreatorNamespace,
  namespaceReducerFactory,
} from './ducks/namespaceHelper';
import configReducer, { changeOwnerAction } from './ducks/config';
import { call, put, takeLatest } from 'redux-saga/effects';
import CallbackPage from './loginCallback';

const DefaultApp = () => {
  return <div>Hello World in Shell ! :D</div>;
};

const MicroApp = ({ entryManifestComponent, ...rest }) => {
  return (
    <ExternalComponent
      interleave={__webpack_require__.interleaved(entryManifestComponent)}
      {...rest}
    />
  );
};

const App = props => {
  const { store, namespace } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  // set namespace `localMetalk8s`
  setActionCreatorNamespace(namespace);
  // Inject our reducer for metalk8s
  useEffect(() => {
    store.injectReducer(
      `${namespace}`,
      namespaceReducerFactory(namespace, configReducer),
    );
  }, []);
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
        <Route path="/metalk8s">
          <MicroApp
            entryManifestComponent="metalK8s/MetalMicroApp"
            store={store}
            namespace="metalk8s"
          />
        </Route>
        <Route
          path="/oauth2/callback"
          component={() => {
            return <CallbackPage />;
          }}
        />
        <Route path="/">
          <DefaultApp />
          <button
            onClick={() =>
              dispatch(nameSpaceAction(changeOwnerAction, 'Yanjin in shell'))
            }
          >
            update shell owner
          </button>
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
