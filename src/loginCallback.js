import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
// import Loader from '../components/Loader';
// import { intl } from '../translations/IntlGlobalProvider';
// import { appNamespaceSelector } from './ducks/namespaceHelper';
// import corsImport from 'webpack-external-import/corsImport';

const CallbackPage = props => {
  // const dispatch = useDispatch();
  const userManager = props.userManager;

  console.log('userManager', props.userManager);

  const history = useHistory();
  return userManager != null ? (
    <CallbackComponent
      userManager={userManager}
      successCallback={user => {
        const path = (user.state && user.state.path) || '/';
        history.push(path);
      }}
      errorCallback={error => {
        history.push('/');
      }}
    >
      <div>redirecting</div>
    </CallbackComponent>
  ) : (
    <div>Loading</div>
  );
};

export default CallbackPage;
