import React, { Component } from 'react';
import { View, Text, ListView, Alert, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import _ from 'lodash';

import styles from './styles';
import * as functions from '../../config/functions';
import * as dataActions from '../../stores/data/actions';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      unsubscribe = null,
      walletTypeLabel = {
        0: 'unknown',
        1: 'topup',
        2: 'buy',
        3: 'sell',
        4: 'interest',
        6: 'withdraw'
      },
      walletStatusLabel = {
        0: 'complete',
        1: 'wait for RDN',
        2: 'Pending',
        3: 'Reject'
      },
      perpage = 10;
let lastValue = null,
    $this = null,
    mounted = false
    firstTimew = true;

export default class ListWallet extends Component {
  constructor (props) {
    super(props);
    this.state = {
      originalData: props.data || [],
      dataSource: ds.cloneWithRows(props.data || []),
      total: props.total || 0,
      refreshing: false
    };
  }

  _handleChanged = () => {
    if ($this.props.currentDetail.walletUpdated && mounted && firstTimew) {
      if ($this.state.originalData && $this.props.currentDetail.wallet && $this.state.originalData.length !== $this.props.currentDetail.wallet.length) {
        $this.state.originalData = $this.props.currentDetail.wallet;
        $this.state.dataSource = ds.cloneWithRows($this.props.currentDetail.wallet || []);
        $this.state.total = $this.props.currentDetail.totalWallet;
        firstTimw = false;
        $this.forceUpdate();
      }
    } else if (!firstTimew && mounted) {
      var thisState = _.find($this.props.store.getState().data.clientList, {id: $this.props.clientid});
      if (thisState && thisState.wallet && $this.state.originalData && thisState.wallet.length !== $this.state.originalData.length) {
        $this.setState({
          originalData: thisState.wallet,
          dataSource: ds.cloneWithRows(thisState.wallet || []),
          total: thisState.totalWallet
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

    fetch($this.props.store.getState().app.backendUrl + 'customer/wallet/grid',
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

          $this.props.store.dispatch(dataActions.updateClientWallet(combined, $this.props.clientid, body.totalRecord));
        }
      })
      .catch(function(err) {
        if (!addMore) $this.setState({refreshing: false});
        $this._alert(err);
      })
      .done();
  }

  _renderList = (rowData) => {
    var icons = walletTypeLabel[rowData.transactionType].toUpperCase(),
        fontSizeUnit = 24;

    if (icons.length > 2) {
      if (icons.length < 4 ) fontSizeUnit = 16;
      else if (icons.length < 5 ) fontSizeUnit = 14;
      else if (icons.length < 6 ) fontSizeUnit = 13;
      else if (icons.length < 8 ) fontSizeUnit = 12;
      else if (icons.length >= 8 ) fontSizeUnit = 10;
    };

    return (
      <View style={{flex: 1}}>
        <View style={styles.rowItem}>
          <View style={styles.icon}>
            <Text style={[styles.iconText, {fontSize: fontSizeUnit}]}>{icons}</Text>
          </View>
            <View style={{flex: 1, paddingLeft: 12}}>
              <Text numberOfLines={1} style={styles.titleName}>BANK</Text>
              <Text numberOfLines={1} style={styles.detailsName}>{rowData.accountNo} {rowData.bankName}</Text>

              <Text numberOfLines={1} style={styles.titleName}>DATE</Text>
              <Text numberOfLines={1} style={styles.detailsName}>{moment(rowData.transactionDate).format("MMMM D, YYYY")}</Text>

              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text numberOfLines={1} style={styles.titleName}>DEBIT</Text>
                  <Text numberOfLines={1} style={styles.detailsName}>IDR {functions.money(rowData.debit || 0)}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text numberOfLines={1} style={styles.titleName}>CREDIT</Text>
                  <Text numberOfLines={1} style={styles.detailsName}>IDR {functions.money(rowData.credit || 0)}</Text>
                </View>
              </View>

              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text numberOfLines={1} style={styles.titleName}>BALANCE</Text>
                  <Text numberOfLines={1} style={[styles.detailsName, {marginBottom: 0}]}>IDR {functions.money(rowData.balance || 0)}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text numberOfLines={1} style={styles.titleName}>STATUS</Text>
                  <Text numberOfLines={1} style={[styles.detailsName, {marginBottom: 0}]}>{walletStatusLabel[rowData.transactionStatus].toUpperCase()}</Text>
                </View>
              </View>
            </View>
        </View>
      </View>
    );
  }

  _moredata = () => {
    if (this.state.originalData && this.state.total && this.state.originalData.length !== this.state.total) {
      // get more data;
      this._getData(this.state.originalData.length, this, true);
    }
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

  componentWillUnmount() {
    mounted = false;
    if (unsubscribe) unsubscribe();
    firstTimew = true;

    this.props.store.dispatch(dataActions.removeWalletTime($this.props.clientid));
  }

  componentDidMount() {
    $this = this;
    mounted = true;
    unsubscribe = this.props.store.subscribe(this._handleChanged);
  }

  render() {
    return (
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
    );
  }

}
