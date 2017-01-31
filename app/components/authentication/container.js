import React, { Component } from 'react';
import Screen from './screen';
import { Alert } from 'react-native';
import Schema from '../../stores/db';
import * as appActions from '../../stores/app/actions';

export default class AuthContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ready: props.data.ready,
      email: 'ev.kristian@gmail.com',
      errorMessages: {
        1: 'Ops, we cannot authenticate your account, make sure you have entered a correct email and password',
        4: 'Ops, we cannot authenticate your account, make sure you have entered a correct email and password',
        10: 'Ops, too much login attempt, Your account has been locked, please try again after ',
        106: 'Ops, your old password is not correct.'
      }
    };
  }

  componentWillReceiveProps(newprops) {
    if (newprops.data.ready !== this.state.ready) {
      this.setState({ready: newprops.data.ready});
    }
  }

  _doLogin = (params) => {
    var app = this.props.store.getState().app,
        $this = this;

    fetch(app.backendUrl + 'auth/login',
      { method: 'POST', body: JSON.stringify({userEmail: params.email, userPassword: params.password})})
      .then(function(res) {
        return res.json();
      })
      .then(function(body) {
        if (!body.isSuccess) {
          var messages = $this.state.errorMessages[body.authCode];
          if (body.message) messages += body.message + ' minutes';
          if (body.jsonError) messages = 'Ops, something went wrong. Please try again later.';

          Alert.alert( 'Sign in failed', messages,
            [ {text: 'OK', onPress: () => { $this.setState({ready: true}); } } ]
          )
        } else {
          // logged in
          var schema = new Schema(),
              app = schema.realm.objects('App');

          schema.realm.write(() => {
            schema.realm.delete(app);
            schema.realm.create('App',
              {
                token: body.authToken,
                name: body.user.name,
                email: body.user.email,
                lastLoginDate: new Date(body.user.lastLoginDate),
                validDate: new Date(body.user.validDate),
                isPasswordChangedRequired: body.user.isPasswordChangedRequired == true || body.user.isPasswordChangedRequired == 'true'
              });
          });

          $this.props.store.dispatch(appActions.login(body.authToken, body.user));
        }
      })
      .catch(function() {
        Alert.alert( 'Something went wrong', 'Ops, something went wrong. Please try again later.',
          [ {text: 'OK', onPress: () => { $this.setState({ready: true}); } } ]
        );
      })
      .done();
  }

  _doChange = (params) => {
    var app = this.props.store.getState().app,
        $this = this;

    fetch(app.backendUrl + 'auth/ForgotPassword',
      { method: 'POST', body: JSON.stringify({email: params.email})})
      .then(function(res) {
        return res.json();
      })
      .then(function(body) {
        Alert.alert( 'Password resetted', 'We have sent your new password to '+params.email+'.',
          [ {text: 'OK', onPress: () => { $this.setState({ready: true}); } } ]
        )
      })
      .catch(function() {
        Alert.alert( 'Something went wrong', 'Ops, something went wrong. Please try again later.',
          [ {text: 'OK', onPress: () => { $this.setState({ready: true}); } } ]
        );
      })
      .done();
  }

  render() {
    return (
      <Screen
        ready={this.state.ready}
        store={this.props.store}
        action={{doLogin: this._doLogin, doChange: this._doChange}}
        extra={{email: this.state.email}}/>
    );
  }
}
