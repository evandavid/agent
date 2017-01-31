import React, { Component } from 'react';
import { ActivityIndicator, View, TextInput, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';

export default class InputScreen extends Component {
  constructor (props) {
    super(props);
    var darkBackground = props.config.darkBackground || false,
        backgroundColor = '#fff',
        iconColor = '#2b323a',
        borderWidth = darkBackground ? 0 : 1,
        borderColor = darkBackground ? '#2b323a' : '#2b323a';

    if (darkBackground)
      backgroundColor = '#F7FEFF';

    this.state = {
      backgroundColor: backgroundColor,
      iconColor: iconColor,
      borderWidth: borderWidth,
      borderColor: borderColor
    }
  }

  _renderIcon = () => {
    if (this.props.config.icon) {
      return (
        <View style={{width: 30, height: 45, justifyContent: 'center'}}>
          <Icon name={this.props.config.icon} size={30} color={this.state.iconColor} />
        </View>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <View style={[{backgroundColor: this.state.backgroundColor, borderWidth: this.state.borderWidth, borderColor: this.state.borderColor}, styles.container]}>
        { this._renderIcon() }
        <View style={{ flex: 1, marginLeft: 6}}>
          <TextInput
            {...this.props}
            placeholder={this.props.config.placeholder || ''}
            style={[styles.input, this.props.style]}
            // placeholderTextColor={this.props.transparent === true ? '#fff' : '#333'}
            onChangeText={this.props.onValue}
            secureTextEntry={this.props.config.secureTextEntry || false}
            keyboardType={this.props.config.keyboardType || 'default'}
            underlineColorAndroid='rgba(0,0,0,0)'
            editable={true}
            // value={this.state.input || this.props.defaultValue}
            defaultValue={this.props.defaultValue || null}
            />
          </View>
      </View>
    );
  }
}
