import React, { Component } from 'react';
import { View, TouchableOpacity, Text, TouchableWithoutFeedback, BackAndroid, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import * as appActions from '../../stores/app/actions';
import * as dataActions from '../../stores/data/actions';

const interval = null,
      sidebarWidth = 270;

export default class Sidebar extends Component {
  constructor (props) {
    super(props);

    BackAndroid.addEventListener('hardwareBackPress', () => {
      var _navigator = props.navigator;

      if (_navigator.getCurrentRoutes().length === 1 && _navigator.getCurrentRoutes()[0].id === 'home' ) {
        if (this.state.revealed) {
          this._toggleSidebar(false);
        } else {
          Alert.alert( 'Confirm exit', 'Are you sure you want to exit?',
            [ {text: 'Cancel', onPress: () => { console.log('test') }},
              {text: 'OK', onPress: () => { BackAndroid.exitApp()}} ]
          );
        }
      } else {
        setTimeout(() => {_navigator.pop();}, 100);
        return true;
      }
      return true;
    });

    this.state = {
      revealed: props.revealed,
      opacity: 0,
      left: -270,
      manuallyOpened: props.manuallyopened,
      user: props.app.user,
      modalVisible: false
    }
  }

  _initialName = (name) => {
    var iName = '';
    if (name) {
      iName += name[0];
      var arr = name.split(' ');
      if (arr.length > 1) iName += arr[1][0];
    }

    return iName;
  }

  _openChangePassword = () => {
    this._toggleSidebar(false);

    setTimeout(() => {
      this.props.openModal();
    }, 600)
  }

  _toggleSidebar = (open) => {
    interval = setInterval(() => {
      if (!open) {
        if (this.state.opacity <= 0) {
          this.props.closeSidebar();
          clearInterval(interval);
          this.setState({revealed: false, opacity: 0, left: -sidebarWidth});
        } else {
          this.setState({
            opacity: this.state.opacity - 0.08,
            left: (((this.state.opacity - 0.08)/0.6) * sidebarWidth) - 300,
          });
        }
      } else {
        if (this.state.opacity >= 0.6) {
          clearInterval(interval);
          this.setState({revealed: true, opacity: 0.6, left: 0});
        } else {
          this.setState({
            opacity: this.state.opacity + 0.08,
            left: (((this.state.opacity + 0.08)/0.6) * sidebarWidth) - 300,
          });
        }
      }
    },0);
  }

  _checkClickPosition = (evt) => {
    if (evt.nativeEvent.locationX > sidebarWidth && this.state.revealed) {
      this._toggleSidebar(false);
    }
  }

  _content = () => {
    if (this.state.revealed) {
      return (
        <TouchableWithoutFeedback onPress={this._checkClickPosition}>
          <View style={[styles.sidebar, {
            zIndex: this.state.revealed ? 1 : -1, backgroundColor: 'rgba(0,0,0,'+this.state.opacity+')'}]}>
            <View style={[styles.sidebarContainer, {
              left: this.state.left
            }]}>
              <View style={styles.sidebarHeader}>

                <View style={styles.initialBox}>
                  <Text style={styles.initialName}>{this._initialName(this.state.user.name)}</Text>
                </View>
                <Text style={styles.commonText}>{this.state.user.name}</Text>
                <Text style={styles.sidebarDetailHeaderText}>{this.state.user.email}</Text>
              </View>

              <View style={styles.sidebarMenuBox}>
                <TouchableOpacity>
                  <View tag={'menuitem'} style={styles.sidebarMenuItem}>
                    <Icon name={'ios-briefcase'} size={22} color={'#444'} style={styles.sidebarIcon}/>
                    <Text style={[styles.usualText, {fontSize: 14}]}>Wallet</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {this._openChangePassword()}}>
                  <View tag={'menuitem'} style={styles.sidebarMenuItem}>
                    <Icon name={'md-key'} size={22} color={'#444'} style={styles.sidebarIcon}/>
                    <Text style={[styles.usualText, {fontSize: 14}]}>Change password</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  this.props.store.dispatch(appActions.logout(this.props.navigator, this.props.store));
                  this.props.store.dispatch(dataActions.clearClientList());}}>
                  <View tag={'menuitem'} style={styles.sidebarMenuItem}>
                    <Icon name={'md-log-out'} size={22} color={'#444'} style={styles.sidebarIcon}/>
                    <Text style={[styles.usualText, {fontSize: 14}]}>Logout</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
    } else return (
      <TouchableWithoutFeedback onPress={this._checkClickPosition}>
      <View/>
      </TouchableWithoutFeedback>
    );
  }

  componentWillReceiveProps(newprops) {
    if (this.state.revealed !== newprops.revealed) {
      this.setState({
        revealed: newprops.revealed,
        opacity: newprops.opacity,
        left: this.state.left + newprops.left
      });
    } else {
      this.setState({
        opacity: newprops.opacity,
        left: -sidebarWidth + newprops.left
      });
    }

    // sidebar open or closed
    if (this.state.manuallyOpened !== newprops.manuallyopened) {
      this.setState({revealed: newprops.manuallyopened});
      this._toggleSidebar(newprops.manuallyopened);
    }
  }

  componentDidMount() {
  }

  componentWillUnmount () {
  }

  render() {
    return this._content();
  }
}
