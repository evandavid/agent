import * as types from './constants';

export function changeAppRoot(type, data) {
  return {type: type, data: data};
}

export function updateList(data, totalRecord) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.UPDATE_CLIENT_LIST, {data: data, totalRecord: totalRecord}));
  };
}

export function addList(data, totalRecord) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.ADD_CLIENT_LIST, {data: data, totalRecord: totalRecord}));
  };
}

export function updateClientTransaction(data, id, total) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.UPDATE_CLIENT_TRANSACTION, {data: data, id: id, total: total}));
  };
}

export function updateClientTransactionTime(id) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.UPDATE_TRANSACTION, {id: id}));
  };
}

export function removeTransactionTime(id) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.REMOVE_TRANSACTION_TIME, {id: id}));
  };
}

export function removeWalletTime(id) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.REMOVE_WALLET_TIME, {id: id}));
  };
}

export function updateClientWalletTime(id) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.UPDATE_WALLET, {id: id}));
  };
}

export function updateClientProfile(data, id) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.UPDATE_CLIENT_PROFILE, {data: data, id: id}));
  };
}

export function updateClientProduct(data, id) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.UPDATE_CLIENT_PRODUCT, {data: data, id: id}));
  };
}

export function updateClientWallet(data, id, total) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.UPDATE_CLIENT_WALLET, {data: data, id: id, total: total}));
  };
}

export function clearClientList() {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(types.CLEAR_CLIENT_LIST, null));
  };
}
