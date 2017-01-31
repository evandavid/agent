import React, { Component } from 'react';
import { View, Text, ListView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import * as functions from '../../config/functions';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ListProduct extends Component {
  constructor (props) {
    super(props);
    this.state = {
      originalData: props.data || [],
      dataSource: ds.cloneWithRows(props.data || [])
    };
  }

  _renderList = (rowData) => {
    var unit = functions.nFormatter(rowData.unit, 4),
        fontSizeUnit = 24;

    if (unit.length > 2) {
      if (unit.length < 5 ) fontSizeUnit = 18;
      else if (unit.length < 6 ) fontSizeUnit = 14;
      else if (unit.length < 8 ) fontSizeUnit = 12;
      else if (unit.length >= 8 ) fontSizeUnit = 10;
    }

    return (
      <View style={{flex: 1}}>
        <View style={styles.rowItem}>
          <View style={styles.icon}>
            <Text style={[styles.iconText, {fontSize: fontSizeUnit}]}>{functions.nFormatter(rowData.unit, 4)}</Text>
          </View>
            <View style={{flex: 1, paddingLeft: 12}}>
              <Text numberOfLines={1} style={styles.name}>{rowData.productName}</Text>
              <Text style={styles.detail}>Investment Manager: {rowData.managerName}</Text>
              <Text style={styles.detail}>Current Unit: {functions.money(rowData.unit)}</Text>
              <Text style={styles.detail}>last NAV: IDR {functions.money(rowData.lastNAV)}</Text>
            </View>
        </View>
      </View>
    )
  }

  componentWillReceiveProps(newprops) {
    if (newprops.data && this.state.originalData.length !== newprops.data.length) {
      this.setState({ originalData: newprops.data, dataSource: ds.cloneWithRows(newprops.data || []) });
    }
  }

  shouldComponentUpdate (newprops) {
    if (newprops.data) return newprops.data.length !== this.state.originalData.length;
    return false;
  }

  render() {
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={this._renderList}
        renderSeparator={(sid, id) => { return <View key={id} style={styles.seperator}/>}}
      />
    );
  }

}
