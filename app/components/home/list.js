import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ListView, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import * as functions from '../../config/functions';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      perpage = 15;
let initial = 15;

export default class List extends Component {
  constructor (props) {
    super(props);
    this.state = {
      originalData: props.data || [],
      dataSource: ds.cloneWithRows(props.data || []),
      refreshing: props.refreshing
    };
  }

  _renderList = (rowData) => {
    return (
      <TouchableOpacity style={{flex: 1}} onPress={() => this.props.selectClient(rowData)}>
        <View>
          <View style={styles.rowItem}>
            <View style={styles.icon}>
              <Text style={styles.iconText}>{rowData.name ? rowData.name[0]: ''}</Text>
            </View>
              <View style={{flex: 1, paddingLeft: 12}}>
                <Text numberOfLines={1} style={styles.name}>{rowData.name}</Text>
                <Text style={styles.detail}>Balance: {rowData.currency} {functions.money(rowData.balance)}</Text>
              </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  componentWillReceiveProps(newprops) {
    if (newprops.data && this.state.originalData.length !== newprops.data.length) {
      this.setState({
        originalData: newprops.data,
        dataSource: ds.cloneWithRows(newprops.data || []),
        refreshing: newprops.refreshing
      });
    }
  }

  shouldComponentUpdate (newprops) {
    if (newprops.data) return newprops.data.length !== this.state.originalData.length;
    return false;
  }

  render() {
    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.props.onrefresh.bind(this)}
          />
        }
        onEndReached={this.props.moredata.bind(this)}
        onEndReachedThreshold={perpage}
        pageSize={perpage}
        initialListSize={perpage}
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={this._renderList}
        renderSeparator={(sid, id) => { return <View key={id} style={styles.seperator}/>}}
      />
    );
  }
}
