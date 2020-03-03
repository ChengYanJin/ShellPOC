import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
// import Loader from '../components/Loader';
// import { intl } from '../translations/IntlGlobalProvider';
// import { appNamespaceSelector } from './ducks/namespaceHelper';
// import corsImport from 'webpack-external-import/corsImport';

const CallbackPage = () => {
  // const dispatch = useDispatch();
  const userManager = useSelector(state => state);

  console.log('userManager', userManager);

  const history = useHistory();
  return (
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
  );
};

export default CallbackPage;
