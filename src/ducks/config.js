import { WebStorageStateStore } from 'oidc-client';
import { loadUser, createUserManager } from 'redux-oidc';

// Action
const CHANGE_OWNER = 'CHANGE_OWNER';
const CREATE_USER_MANAGER = 'CREATE_USER_MANAGER';
// Action Creator
export const changeOwnerAction = newOwner => {
  return { type: CHANGE_OWNER, payload: newOwner };
};

export const createUserManagerAction = () => {
  return { type: CREATE_USER_MANAGER };
};

// Reducer
const defaultState = {
  owner: '',
  userManager: null,
};

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'CHANGE_OWNER':
      return { ...state, owner: action.payload };
    case 'CREATE_USER_MANAGER': {
      const config = {
        client_id: 'metalk8s-ui',
        redirect_uri: 'http://localhost:3000/oauth2/callback',
        response_type: 'id_token',
        scope:
          'openid profile email offline_access audience:server:client_id:oidc-auth-client',
        authority: 'https://172.21.254.14:8443/oidc',
        loadUserInfo: false,
        post_logout_redirect_uri: '/',
        userStore: new WebStorageStateStore({ store: localStorage }),
      };

      const userManager = createUserManager(config);
      return { ...state, userManager };
    }
    default:
      return state;
  }
};
