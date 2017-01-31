import * as types from './constants';
import Immutable from 'seamless-immutable';
import _ from 'lodash';
import Schema from '../db';

const initialState = {
  orientation: 'PORTRAIT',
  changesOnFirstLoad: false,
  loggedIn: false,
  authToken: null,
  user: {},
  backendUrl: null,
  currentClient: null
}

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOGGED_IN:
      return _.assignIn(state, {
        loggedIn: true,
        user: action.data.user,
        authToken: action.data.authToken
      });
      break;
    case types.LOGGED_OUT:
      var schema = new Schema(),
          app = schema.realm.objects('App');

      schema.realm.write(() => {
        schema.realm.delete(app);
      });
      action.data.navigator.replaceAtIndex({ id: 'login' }, 0);
      action.data.navigator.popToTop(0);

      return _.assignIn(state, {
        loggedIn: false,
        user: {},
        authToken: null
      });
      break;
    case types.CHANGE_ORI:
      return _.assignIn(state, {
        orientation: action.data.orientation,
        changesOnFirstLoad: action.data.initial,
      });
      break;
    case types.CHANGE_TOKEN:
      return _.assignIn(state, {
        authToken: action.data.authToken
      });
      break;
    case types.UPDATE_URL:
      return _.assignIn(state, {
        backendUrl: action.data.backendUrl
      });
      break;
    case types.CHANGE_USER:
      return _.assignIn(state, {
        user: action.data.user
      });
      break;
    case types.CHANGE_CLIENT:
      return _.assignIn(state, {
        currentClient: action.data
      });
      break;
    default:
      return state;
  }
}
