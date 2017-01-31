import React, { Component } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text, Platform, PanResponder,
  Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import Input from '../input';
import * as functions from '../../config/functions';
import lodash from 'lodash';
import * as dataActions from '../../stores/data/actions';
import Sidebar from './sidebar';
import List from './list';

const perpage = 15,
      opacity = 0.6;
let initial = 15,
    sidebarOpened = false;

export default class HomeScreen extends Component {
  constructor (props) {
    super(props);

    this.state = {
      refreshing: false,
      animating: !props.ready,
      originalData: props.data || {details: [], totalRecord: 0},
      sidebarRevealed: false,
      opacity: 0,
      left: 0,
      toggleSidebar: false,
      modalVisible: false,
      oldPassword: null,
      newPassword: null
      // closeAnimation: new Animated.Value(0),
    }

    if (props.initial) initial = props.initial;
  }

  _openModal = () => {
    this.setState({modalVisible: true});
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    setTimeout(() => {
      this.props.refresh({}, true);
    }, 500);
  }

  _moreData = () => {
    if (this.state.originalData.details && this.state.originalData.totalRecord !== this.state.originalData.details.length) {
      this.props.refresh({skip: initial}, false);
      initial += perpage;
    }
  }

  _switchDisplay = () => {
    if (this.state.animating) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator
            animating={this.state.animating}
            style={[styles.centering, {height: 80}]}
            size="large"
          />
        </View>
      )
    } else {
      return this._mainDisplay();
    }
  }

  _closeSidebar = () => {
    lodash.extend(this.state, {
      toggleSidebar: false,
      sidebarRevealed: false,
      left: 0,
      opacity: 0
    });

    sidebarOpened = false;
  }

  _alert = (err) => {
    Alert.alert( 'Something went wrong', 'Ops, something went wrong. Please try again later.',
      [ {text: 'OK', onPress: () => { console.log('something happen', err); } } ]
    );
  }

  sendChangePassword = () => {
    var data = JSON.stringify({oldPassword: this.state.oldPassword, newPassword: this.state.newPassword}),
        $this = this;

    fetch(this.props.store.getState().app.backendUrl + 'auth/changepassword',
      { method: 'POST', body: data })
      .then(function(res) {
        return res.json();
      })
      .then(function(body) {
        if (body !== 0) {
          Alert.alert( 'Change password failed', 'Ops, your old password is not correct.',
            [ {text: 'OK', onPress: () => { console.log('something happen', err); } } ]
          );
        } else {
          Alert.alert( 'Change password success', 'Congratulations, your password has been changed.',
            [ {text: 'OK', onPress: () => { $this.setState({modalVisible: false}); } } ]
          );
        }
      })
      .catch(function(err) {
        $this._alert(err);
      })
      .done();
  }

  _mainDisplay = () => {
    // this.props.store.dispatch(appActions.logout(this.props.navigator))
    return (
      <View {...this._panResponder.panHandlers} style={styles.container} onLayout={(event) => { functions.onLayout(event, this.props.store)}}>
        <View tag={'header'} style={Platform.OS === 'ios' ? styles.header : styles.headerAndroid}>
          <TouchableOpacity
            style={Platform.OS === 'ios' ? styles.menu : styles.menuAndroid}
            onPress={() => {this.setState({toggleSidebar: true});}}>
            <View>
              <Icon name={'ios-menu'} size={30} color={'#fff'} />
            </View>
          </TouchableOpacity>
          <Text style={Platform.OS === 'ios' ? styles.headerText : styles.headerTextAndroid}>MODOIT AGENT</Text>
        </View>
        <Sidebar
          revealed={this.state.sidebarRevealed}
          opacity={this.state.opacity}
          left={this.state.left}
          manuallyopened={this.state.toggleSidebar}
          closeSidebar={this._closeSidebar}
          app={this.props.extra.app}
          store={this.props.store}
          openModal={this._openModal.bind(this)}
          navigator={this.props.navigator}/>

        <View style={{flex: 1}}>
          <List
            data={this.state.originalData.details}
            refreshing={this.state.refreshing}
            onrefresh={this._onRefresh.bind(this)}
            moredata={this._moreData.bind(this)}
            selectClient={this.props.selectClient} />

        </View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}>

          <View style={{backgroundColor: 'rgba(0,0,0,0.6)',flex: 1, paddingVertical: 80, paddingHorizontal: 24}}>
             <View style={{backgroundColor: '#fff', height: 270, position: 'relative', paddingTop: 12, paddingBottom: 56}}>
              <View style={{paddingVertical: 12, paddingHorizontal: 24}}>
                <Text style={{fontSize: 16, marginBottom: 24}}>Change Password</Text>

                <Input
                  config={{darkBackground: false, placeholder: 'Old Password', secureTextEntry: true}}
                  onValue={(value) => this.setState({oldPassword: value})}/>
                <Input
                  config={{darkBackground: false, placeholder: 'New Password', secureTextEntry: true}}
                  onValue={(value) => this.setState({newPassword: value})}/>

              </View>
               <View style={{flexDirection: 'row', position: 'absolute', bottom: 0, right: 0, left: 0, height: 45}}>
                 <TouchableOpacity
                   style={{flex: 1}}
                   onPress={() => {this.setState({modalVisible: false})}}>
                   <View style={[styles.button, {backgroundColor: '#efefef'}]}>
                     <Text style={[styles.buttonText, {color: '#333'}]}>CLOSE</Text>
                   </View>
                 </TouchableOpacity>

                 <TouchableOpacity
                   style={{flex: 1}}
                   onPress={() => {this.sendChangePassword()}}>
                   <View style={styles.button}>
                     <Text style={styles.buttonText}>SUBMIT</Text>
                   </View>
                 </TouchableOpacity>
               </View>
             </View>
          </View>

          </Modal>
      </View>
    )
  }

  componentWillMount() {
    var currentXTouched = 100,
        touchFromTip = false,
        interval;

    // handle swipe from side of screen to reveal sidebar
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder:(evt, gestureState) => {
        if (gestureState.moveX < 15) {
          // start from tip of screen
          currentXTouched = gestureState.moveX;
          touchFromTip = true;
          return true;
        } else touchFromTip = false;
        return false;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (touchFromTip) {
          if (gestureState.moveX > currentXTouched && !sidebarOpened) {
            if (gestureState.moveX < 200) {
              // sneak peak sidebar menu

              this.setState({opacity: (gestureState.moveX/200) * opacity, left: gestureState.moveX});
            } else {
              // reveal sidebar menu
              sidebarOpened = true;
              this.setState({opacity: opacity, left: 270});
            }
            currentXTouched = gestureState.moveX;
            this.setState({sidebarRevealed: true});
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // touch ended
        if (this.state.sidebarRevealed && !sidebarOpened) {
          interval = setInterval(() => {
            if (this.state.opacity <= 0) {
              clearInterval(interval);
              this.setState({sidebarRevealed: false, opacity: 0, left: 0});
            } else {
              this.setState({
                opacity: this.state.opacity - 0.08,
                left: (this.state.opacity - 0.08) * 270,
              });
            }
          },0.5);
        }
      },
      onStartShouldSetPanResponder: () => {
        return false;
      }
    });
  }

  componentWillReceiveProps(newprops) {
    if (!newprops.ready !== this.state.animating) {
      this.setState({animating: !newprops.ready, email: newprops.extra.email});
    }

    // update data
    if (this.state.originalData.details !== newprops.data.details && newprops.hardrefresh) {
      this.setState({
        originalData: newprops.data,
        refreshing: false
      });
      this.props.store.dispatch(dataActions.updateList(newprops.data.details, newprops.data.totalRecord));
      initial = newprops.initial;
    }

    if (!newprops.hardrefresh && newprops.data.details && newprops.data.details.length) {
      var combined = lodash.union(this.state.originalData.details || [], newprops.data.details);

      this.setState({
        originalData: { details: combined, totalRecord: newprops.data.totalRecord },
        refreshing: false
      });
      this.props.store.dispatch(dataActions.addList(newprops.data.details, newprops.data.totalRecord));
      initial = newprops.initial;
    }
  }

  render() {
    return this._switchDisplay();
  }
}
