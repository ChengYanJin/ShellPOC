// Action
const CHANGE_OWNER = 'CHANGE_OWNER';

// Action Creator
const changeOwnerAction = newOwner => {
  return { type: CHANGE_OWNER, payload: newOwner };
};

// Reducer
const defaultState = {
  owner: '',
};

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'CHANGE_OWNER':
      return { ...state, owner: action.payload };
  }
  return state;
};
