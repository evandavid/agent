import React, { Component } from 'react';
import { View, Text, ListView, Alert, RefreshControl, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import _ from 'lodash';

import styles from './styles';
import * as functions from '../../config/functions';
import * as dataActions from '../../stores/data/actions';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      unsubscribe = null,
      perpage = 10,
      historyTansactionTypeLabel = {
        0: 'unknown',
        1: 'buy',
        2: 'sell',
        5: 'switching in',
        6: 'switching out'
      },
      historyTansactionStatusLabel = {
        0: 'pending',
        1: 'complete',
        2: 'reject'
      };
let lastValue = null,
    $this = null,
    mounted = false,
    firstTime = true;

export default class ListTransaction extends Component {
  constructor (props) {
    super(props);
    this.state = {
      originalData: props.data || [],
      dataSource: ds.cloneWithRows(props.data || []),
      dataSourceDetails: ds.cloneWithRows([]),
      total: props.total || 0,
      refreshing: false,
      modalVisible: false
    };
  }

  _handleChanged = () => {
    if ($this.props.currentDetail.transactionsUpdated && mounted && firstTime) {
      if ($this.state.originalData && $this.props.currentDetail.transactions && $this.state.originalData.length !== $this.props.currentDetail.transactions.length) {
        $this.state.originalData = $this.props.currentDetail.transactions;
        $this.state.dataSource = ds.cloneWithRows($this.props.currentDetail.transactions || []);
        $this.state.total = $this.props.currentDetail.totalTransaction;
        firstTime = false;
        $this.forceUpdate();
      }
    } else if (!firstTime && mounted) {
      var thisState = _.find($this.props.store.getState().data.clientList, {id: $this.props.clientid});
      if (thisState && thisState.transactions && $this.state.originalData && thisState.transactions.length !== $this.state.originalData.length) {
        $this.setState({
          originalData: thisState.transactions,
          dataSource: ds.cloneWithRows(thisState.transactions || []),
          total: thisState.totalTransaction
        });
      }
    }
  }

  _alert = (err) => {
    Alert.alert( 'Something went wrong', 'Ops, something went wrong. Please try again later.',
      [ {text: 'OK', onPress: () => { console.log('something happen', err); } } ]
    );
  }

  _getData = (skip, $this, addMore) => {
    var params = {filter: [{
      operator: '=',
      field: 'userId',
      value: $this.props.clientid,
      type: 0
    }], sort: [], take: 10, skip: skip || 0};

    var data = JSON.stringify(params);
    if (!addMore) $this.setState({refreshing: true});

    fetch($this.props.store.getState().app.backendUrl + 'customer/transaction/grid',
      { method: 'POST', body: data })
      .then(function(res) {
        return res.json();
      })
      .then(function(body) {
        if (body.details) {
          var combined =  [];
          if (addMore) combined = _.union($this.state.originalData || [], body.details);
          else combined = body.details;

          if (!addMore) $this.setState({refreshing: false});

          $this.props.store.dispatch(dataActions.updateClientTransaction(combined, $this.props.clientid, body.totalRecord));
        }
      })
      .catch(function(err) {
        if (!addMore) $this.setState({refreshing: false});
        $this._alert(err);
      })
      .done();
  }

  _showDetail = (data) => {
    this.setState({
      dataSourceDetails: ds.cloneWithRows(data.userTransactionDetails || [])
    });
    this.setModalVisible(true);
  }

  _renderList = (rowData) => {
    return (
      <TouchableOpacity style={{flex: 1}} onPress={() => {this._showDetail(rowData)}}>
        <View style={styles.rowItem}>
          <View style={styles.icon}>
            <Text style={[styles.iconText, {fontSize: 24}]}>{rowData.userTransactionDetails.length || 0}</Text>
          </View>
            <View style={{flex: 1, paddingLeft: 12}}>
              <Text numberOfLines={1} style={styles.name}>{moment(rowData.transactionDate).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Text>
              <Text style={styles.detail}>Total Buy: IDR {functions.money(rowData.totalBuy)}</Text>
              <Text style={styles.detail}>Total Sell: IDR {functions.money(rowData.totalSell)}</Text>
              <Text style={styles.detail}>Total Transaction: {rowData.userTransactionDetails.length || 0}</Text>
            </View>
        </View>
      </TouchableOpacity>
    );
  }

  _moredata = () => {
    if (this.state.originalData && this.state.total && this.state.originalData.length !== this.state.total) {
      // get more data;
      this._getData(this.state.originalData.length, this, true);
    }
  }

  _switching = (row) => {
    if (row.transactionType > 4) {
      return (
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.titleName}>Switching Fee Amount</Text>
            <Text numberOfLines={1} style={[styles.detailsName]}>
              IDR {functions.money(row.transactionFees.switchingFeeAmount)}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.titleName}>Switching Fee Percent</Text>
            <Text numberOfLines={1} style={[styles.detailsName]}>
              {row.transactionFees.switchingFeePercent}%
            </Text>
          </View>
        </View>
      );
    } else return null;
  }

  _renderListDetails = (row) => {
    return (
      <View style={{paddingVertical: 12, paddingHorizontal: 12}}>
        <Text style={[styles.name]}>{row.productName}</Text>
        <Text style={[styles.detail, {marginBottom: 12}]}>Investment Manager: {row.mi}</Text>

        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.titleName}>Transaction Type</Text>
            <Text numberOfLines={1} style={[styles.detailsName]}>
              {historyTansactionTypeLabel[row.transactionType].toUpperCase()}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.titleName}>Transaction Status</Text>
            <Text numberOfLines={1} style={[styles.detailsName]}>
              {historyTansactionStatusLabel[row.transactionStatus].toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.titleName}>NAV on transaction</Text>
            <Text numberOfLines={1} style={[styles.detailsName]}>
              IDR {functions.money(row.nav)}
            </Text>
          </View>
        </View>

        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.titleName}>Amount</Text>
            <Text numberOfLines={1} style={[styles.detailsName]}>
              IDR {functions.money(row.amount)}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.titleName}>Unit</Text>
            <Text numberOfLines={1} style={[styles.detailsName]}>
              {functions.money(row.unit)} Unit
            </Text>
          </View>
        </View>

        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.titleName}>Redemption Fee Amount</Text>
            <Text numberOfLines={1} style={[styles.detailsName]}>
              IDR {functions.money(row.transactionFees.redemptionFeeAmount)}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.titleName}>Redemption Fee Percent</Text>
            <Text numberOfLines={1} style={[styles.detailsName]}>
              {row.transactionFees.redemptionFeePercent}%
            </Text>
          </View>
        </View>

        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.titleName}>Subscription Fee Amount</Text>
            <Text numberOfLines={1} style={[styles.detailsName]}>
              IDR {functions.money(row.transactionFees.subscriptionFeeAmount)}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.titleName}>Subscription Fee Percent</Text>
            <Text numberOfLines={1} style={[styles.detailsName]}>
              {row.transactionFees.subscriptionFeePercent}%
            </Text>
          </View>
        </View>

        {this._switching(row)}

      </View>
    );
  }

  componentWillReceiveProps(newprops) {
    if (newprops.data && this.state.originalData && this.state.originalData.length !== newprops.data.length) {
      this.setState({ originalData: newprops.data, dataSource: ds.cloneWithRows(newprops.data || []) });
    }
  }

  shouldComponentUpdate (newprops) {
    if (newprops.data && this.state.originalData) return newprops.data.length !== this.state.originalData.length;
    return false;
  }

  componentWillUnmount() {
    mounted = false;
    if (unsubscribe) unsubscribe();
    firstTime = true;

    this.props.store.dispatch(dataActions.removeTransactionTime($this.props.clientid));
  }

  componentDidMount() {
    $this = this;
    mounted = true;
    unsubscribe = this.props.store.subscribe(this._handleChanged);
  }

  setModalVisible(visible) {
    if (visible) console.log('=== modal opened ====');
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this._getData(0, this, false);
              }}
            />
          }
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderList}
          onEndReached={this._moredata.bind(this)}
          onEndReachedThreshold={perpage}
          renderSeparator={(sid, id) => { return <View key={id} style={styles.seperator}/>}}
        />
        <Modal
          style={{zIndex: 4}}
          animationType={'fade'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}>
           <View style={{backgroundColor: 'rgba(0,0,0,0.6)',flex: 1, paddingVertical: 80, paddingHorizontal: 24}}>
              <View style={{backgroundColor: '#fff', flex: 1, position: 'relative', paddingTop: 12, paddingBottom: 56}}>

              <ListView
                enableEmptySections={true}
                dataSource={this.state.dataSourceDetails}
                renderRow={this._renderListDetails}
                renderSeparator={(sid, id) => { return <View key={id} style={styles.seperator}/>}}
              />

                <TouchableOpacity
                  style={{position: 'absolute', bottom: 0, right: 0}}
                  onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>CLOSE</Text>
                  </View>
                </TouchableOpacity>

              </View>
           </View>
        </Modal>
      </View>
    );
  }

}
