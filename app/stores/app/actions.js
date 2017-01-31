import * as types from './constants';

export function changeAppRoot(type, data) {
  return {type: type, data: data};
}

export function login(token, user) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.LOGGED_IN, { authToken: token, user: user}));
  };
}

export function logout(_navigator) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.LOGGED_OUT, {navigator: _navigator, token: undefined, data: { email: undefined, name: undefined }}));
  };
}

export function changeOri(initial, orientation) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.CHANGE_ORI, { initial: initial, orientation: orientation }));
  };
}

export function changeToken(token) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.CHANGE_TOKEN, { authToken: token }));
  };
}

export function updateBalance(balance) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.UPDATE_BALAN, { balance: balance }));
  };
}

export function updateBackendUrl(url) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.UPDATE_URL, { backendUrl: url }));
  };
}

export function updateUser(user) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.CHANGE_USER, { user: user }));
  };
}

export function changeClient(client) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.CHANGE_CLIENT, client));
  };
}
