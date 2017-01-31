import React, { Component } from 'react';
import codePush from 'react-native-code-push';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import fetchIntercept from 'fetch-intercept';
import { Navigator, ActivityIndicator, Platform, StatusBar, Alert, BackAndroid} from 'react-native';

import { registerScreens } from "./config/routes";
import * as reducers from './stores';
import * as appActions from './stores/app/actions';
import * as dataActions from './stores/data/actions';
import Schema from './stores/db';

let screenOrientation = null;
let interceptorInstance = null;
let unsubscribe = null;
let currentValue = null;
let _navigator = null;

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

BackAndroid.addEventListener('hardwareBackPress', () => {

  console.log('==== ROUTES ====');
  console.log(_navigator.getCurrentRoutes())

  if (_navigator.getCurrentRoutes().length === 1 && _navigator.getCurrentRoutes()[0].id === 'home' ) {
    return false
    console.log('==== ROUTES EXIT ====');
    console.log(_navigator.getCurrentRoutes())
  } else {
    _navigator.pop();
    return true;
  }
});

export default class agent extends Component {
  constructor (props) {
    super(props);

    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', true);
    } else {
      StatusBar.setBackgroundColor('#454C54');
    }

    currentValue = JSON.parse(JSON.stringify(store.getState().app));

    this._registerInterceptor();
    this.state = {
      ready: true,
      loggedIn: currentValue.loggedIn || false
    }

    unsubscribe = store.subscribe(this._handleChange.bind(this));
  }

  _registerInterceptor = () => {
    interceptorInstance = fetchIntercept.register({
      request: function (url, config) {
        // Modify the url or config here
        console.log('===URL====', url);
        if (!config) config = {};
        if (!config.headers) config.headers = {};
        config.headers['ag-token'] = store.getState().app.authToken;
        config.headers['Content-Type'] = 'application/json';
        config.headers['Cache-Control'] = 'no-cache';

        console.log('===HEADER====', config.headers);

        return [url, config];
      },

      requestError: function (error) {
        return Promise.reject(error);
      },

      response: function (response) {
        if (response.status === 401 && response.url.indexOf(store.getState().app.backendUrl || ' ') > -1) {
          // session ended, back to login
          store.dispatch(appActions.logout(_navigator, store));
          store.dispatch(dataActions.clearClientList());

        } else {
          try {
            JSON.parse(response._bodyText);
          } catch (e) {
            response._bodyText = JSON.stringify({
              jsonError: true,
              message: 'not a valid json'
            });
          }

          // check if refresh token is available
          var token = response.headers.get('ag-token-new');
          if (token) {
            store.dispatch(appActions.changeToken(token));
          }
        }

        return response;
      },

      responseError: function (error) {
        return Promise.reject(error);
      }
    });
  }

  _handleChange() {
    var presentValue = store.getState().app;

    if ( presentValue.loggedIn !== currentValue.loggedIn ) {
      currentValue = JSON.parse(JSON.stringify(presentValue));;
      this.setState({ loggedIn: presentValue.loggedIn });

      // move to dashboard
      _navigator.replaceAtIndex({
        id: presentValue.loggedIn === true ? 'home' : 'login'
      }, 0);

      // clear all and back to login
      if (presentValue.loggedIn === false) _navigator.popToTop(0);
    }
  }

  _unregisterInterceptor = () => {
    if (interceptorInstance) interceptorInstance();
    // if (unsubscribe) unsubscribe();
  }

  componentDidMount() {
    var app = store.getState().app,
        $this = this,
        schema = new Schema(),
        app = schema.realm.objects('App');

    if (app.length) {

      var _app = app[0];
      store.dispatch(appActions.login(_app.token, {
        name: _app.name,
        email: _app.email,
        lastLoginDate: _app.lastLoginDate,
        validDate: _app.validDate,
        isPasswordChangedRequired: _app.isPasswordChangedRequired
      }));
    }

    if (!app.backendUrl) {
      $this._getBackendUrl($this);
    }
  }

  _getBackendUrl = ($this) => {
    $this.setState({ready: false});
    fetch('https://dst-dummy.firebaseio.com/agent.json')
      .then(function(res) {
        return res.json();
      })
      .then(function(body) {
        store.dispatch(appActions.updateBackendUrl(body));
        $this.setState({ready: true, loggedIn: $this.state.loggedIn});
      })
      .catch(function() {
        Alert.alert( 'You are offline', 'Make sure you have active internet connection.',
          [ {text: 'OK', onPress: () => { $this.setState({ready: true, loggedIn: $this.state.loggedIn});}} ]
        );
      })
      .done();
  }

  componentWillUnmount() {
    this._unregisterInterceptor();
  }

  render() {
    return (
      <Navigator
        onLayout={this._onLayout}
        initialRoute={{id: this.state.loggedIn === true ? 'home': 'login'}}
        renderScene={this.navigatorRenderScene.bind(this)}/>
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    return registerScreens(route, navigator, store, { ready: this.state.ready });
  }
}

agent = codePush(agent);
