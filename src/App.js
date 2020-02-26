import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom';
import { ExternalComponent } from 'webpack-external-import';
import { useSelector } from 'react-redux';
import { Navbar } from '@scality/core-ui';

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
  const { store } = props;
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
        <Route path="/metalk8s">
          <MicroApp
            entryManifestComponent="metalK8s/MetalMicroApp"
            store={store}
            namespace="metalk8s"
          />
        </Route>
        <Route path="/">
          <DefaultApp />
        </Route>
      </Switch>
    </>
  );
};

export default App;
