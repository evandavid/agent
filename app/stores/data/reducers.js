import * as types from './constants';
import Immutable from 'seamless-immutable';
import _ from 'lodash';
import Schema from '../db';

const initialState = {
  clientList: [],
  totalRecord: 0
};

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case types.UPDATE_CLIENT_LIST:
      return _.assignIn(state, {
        clientList: action.data.data,
        totalRecord: action.data.totalRecord
      });
      break;
    case types.UPDATE_CLIENT_TRANSACTION:
      var client = _.find(state.clientList, {id: action.data.id});
      if (client) {
        client.transactions = action.data.data;
        client.totalTransaction = action.data.total;
      }
      return state;
      break;
    case types.UPDATE_TRANSACTION:
      var client = _.find(state.clientList, {id: action.data.id});
      if (client) client.transactionsUpdated = (new Date()).getTime();
      return state;
      break;
    case types.REMOVE_TRANSACTION_TIME:
      var client = _.find(state.clientList, {id: action.data.id});
      if (client) client.transactionsUpdated = null;
      return state;
      break;
    case types.REMOVE_WALLET_TIME:
      var client = _.find(state.clientList, {id: action.data.id});
      if (client) client.walletUpdated = null;
      return state;
      break;
    case types.UPDATE_WALLET:
      var client = _.find(state.clientList, {id: action.data.id});
      if (client) client.walletUpdated = (new Date()).getTime();
      return state;
      break;
    case types.UPDATE_CLIENT_PROFILE:
      var client = _.find(state.clientList, {id: action.data.id});
      if (client) client.profile = action.data.data;
      return state;
      break;
    case types.UPDATE_CLIENT_WALLET:
      var client = _.find(state.clientList, {id: action.data.id});
      if (client) {
        client.wallet = action.data.data;
        client.totalWallet = action.data.total;
      }
      return state;
      break;
    case types.UPDATE_CLIENT_PRODUCT:
      var client = _.find(state.clientList, {id: action.data.id});
      if (client) client.products = action.data.data;
      return state;
      break;
    case types.ADD_CLIENT_LIST:
      return _.assignIn(state, {
        clientList: _.union(state.clientList || [], action.data.data),
        totalRecord: action.data.totalRecord
      });
      break;
    case types.CLEAR_CLIENT_LIST:
      return {
        clientList: [],
        totalRecord: 0
      }
      break;
    default:
      return state;
  }
}
