import React, { Component } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text, KeyboardAvoidingView } from 'react-native';

import styles from './styles';
import Input from '../input';
import * as functions from '../../config/functions'

export default class LoadingScreen extends Component {
  constructor (props) {
    super(props);

    this.state = {
      animating: !props.ready,
      email: props.extra.email,
      password: 'Password',
      changePassword: false,
      emailChange: null
    }
  }

  _switchDisplay = () => {
    if (this.state.animating) {
      return (
          <ActivityIndicator
            animating={this.state.animating}
            style={[styles.centering, {height: 80}]}
            size="large"
          />
      )
    } else {
      return this._loginDisplay();
    }
  }

  _loginButtonClicked = () => {
    this.setState({animating: true});

    // send data to backend
    this.props.action.doLogin({email: this.state.email, password: this.state.password});
  }

  _resetPasswordClicked = () => {
    this.setState({animating: true});

    this.props.action.doChange({email: this.state.emailChange});
  }

  _loginDisplay = () => {
    if (this.state.changePassword) {
      return (
        <View style={{alignSelf: 'stretch'}}>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>MODOIT AGENT</Text>
            <Text style={styles.welcomeSubTitle}>Welcome back, please sign in to continue</Text>
          </View>
          <KeyboardAvoidingView behavior={'position'}>
            <Input
              config={{darkBackground: true, icon: 'ios-mail', placeholder: 'Email address'}}
              onValue={(value) => this.setState({emailChange: value})}
              defaultValue={this.state.emailChange}/>

            <TouchableOpacity onPress={() => {this._resetPasswordClicked()}}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>RESET PASSWORD</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {this.setState({changePassword: false})}}>
              <View style={styles.forgotContainer}>
                <Text style={styles.forgot}>Back to login page</Text>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    } else {
      return (
        <View style={{alignSelf: 'stretch'}}>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>MODOIT AGENT</Text>
            <Text style={styles.welcomeSubTitle}>Welcome back, please sign in to continue</Text>
          </View>
          <KeyboardAvoidingView behavior={'position'}>
            <Input
              config={{darkBackground: true, icon: 'ios-mail', placeholder: 'Email address'}}
              onValue={(value) => this.setState({email: value})}
              defaultValue={this.state.email}/>
            <Input
              config={{darkBackground: true, icon: 'md-key', placeholder: 'Password', secureTextEntry: true}}
              onValue={(value) => this.setState({password: value})}
              defaultValue={this.state.password}/>

            <TouchableOpacity onPress={() => {this._loginButtonClicked()}}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>SIGN IN</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {this.setState({changePassword: true, emailChange: null})}}>
              <View style={styles.forgotContainer}>
                <Text style={styles.forgot}>Forgot password?</Text>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }

  componentWillReceiveProps(newprops) {
    if (!newprops.ready !== this.state.animating) {
      this.setState({animating: !newprops.ready, email: newprops.extra.email});
    }
  }

  render() {
    return (
      <View style={styles.container} onLayout={(event) => { functions.onLayout(event, this.props.store)}}>
        {this._switchDisplay()}
      </View>
    );
  }
}
