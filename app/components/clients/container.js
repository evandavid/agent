import React, { Component } from 'react';
import Screen from './screen';
import { Alert } from 'react-native';
import _ from 'lodash';

import Schema from '../../stores/db';
import * as appActions from '../../stores/app/actions';
import * as dataActions from '../../stores/data/actions';
let getState = null,
    thisState = null;

export default class ClientContainer extends Component {
  constructor (props) {
    super(props);
    getState = this.props.store.getState();
    thisState = _.find(getState.data.clientList, {id: getState.app.currentClient.id});

    this.state = {
      client:  getState.app.currentClient,
      clientList: getState.data.clientList,
      currentClientDetail: thisState,
      products: [],
      transactions: [],
      wallet: [],
      profile: {},
      totalWallet: 0,
      totalTransaction: 0,
    };
  }

  _alert = (err) => {
    Alert.alert( 'Something went wrong', 'Ops, something went wrong. Please try again later.',
      [ {text: 'OK', onPress: () => { console.log('something happen', err); } } ]
    );
  }

  _getWallet = (skip, $this, firstTime) => {
    var params = {filter: [{
      operator: '=',
      field: 'userId',
      value: this.state.client.id,
      type: 0
    }], sort: [], take: 10, skip: skip || 0};

    var data = JSON.stringify(params);

    fetch(getState.app.backendUrl + 'customer/wallet/grid',
      { method: 'POST', body: data })
      .then(function(res) {
        return res.json();
      })
      .then(function(body) {
        if (body.details) {
          $this.setState({wallet: body.details});
          $this.props.store.dispatch(dataActions.updateClientWallet(body.details, $this.state.client.id, body.totalRecord));
        }
      })
      .catch(function(err) {
        $this._alert(err);
      })
      .done();

  }

  _getTransaction = (skip, $this, firstTime) => {
    var params = {filter: [{
      operator: '=',
      field: 'userId',
      value: this.state.client.id,
      type: 0
    }], sort: [], take: 10, skip: skip || 0};

    var data = JSON.stringify(params);

    fetch(getState.app.backendUrl + 'customer/transaction/grid',
      { method: 'POST', body: data })
      .then(function(res) {
        return res.json();
      })
      .then(function(body) {
        if (body.details) {
          $this.setState({transactions: body.details});
          $this.props.store.dispatch(dataActions.updateClientTransaction(body.details, $this.state.client.id, body.totalRecord));
          if (firstTime) {
            $this._getWallet(0, $this, true);
          }
        }
      })
      .catch(function(err) {
        $this._alert(err);
      })
      .done();
  }

  _getProfile = () => {
    var $this = this;

    fetch(getState.app.backendUrl + 'customer/details?id='+$this.state.client.id,
      { method: 'GET' })
      .then(function(res) {
        return res.json();
      })
      .then(function(body) {
        $this.setState({profile: body});
        $this.props.store.dispatch(dataActions.updateClientProfile(body, $this.state.client.id));
        $this._getTransaction(0, $this, true);
      })
      .catch(function(err) {
        $this._alert(err);
      })
      .done();
  }

  _getProduct = () => {
    var params = {filter: [{
      operator: '=',
      field: 'userId',
      value: this.state.client.id,
      type: 0
    }], sort: [], take: 1000, skip: 0},
        $this = this;

    var data = JSON.stringify(params);

    fetch(getState.app.backendUrl + 'customer/product/grid',
      { method: 'POST', body: data })
      .then(function(res) {
        return res.json();
      })
      .then(function(body) {
        if (body.details) {
          $this.setState({products: body.details});
          $this.props.store.dispatch(dataActions.updateClientProduct(body.details, $this.state.client.id));
          $this._getProfile();
        }
      })
      .catch(function(err) {
        $this._alert(err);
      })
      .done();
  }

  _getInitialData = () => {
    // get initial data
    setTimeout(() => {
      this._getProduct();
    }, 500);
  }

  componentWillReceiveProps(newprops) {
  }

  componentDidMount() {
    if (!this.state.currentClientDetail.products) {
      this._getInitialData();
    } else {
      setTimeout(() => {
      this.setState({
        // client: getState.app.currentClient,
        // clientList: getState.data.clientList,
        products: thisState.products || [],
        // transactions: thisState.transactions || [],
        // wallet: thisState.wallet || [],
        profile: thisState.profile || {},
        // totalWallet: thisState.totalWallet,
        // totalTransaction: thisState.totalTransaction,
      });
    }, 500)
    }
    // else {
      // setTimeout(() => {
      //   this.setState({
      //     products: this.state.currentClientDetail.products,
      //     profile: this.state.currentClientDetail.profile
      //   });
      // }, 300)
      // setTimeout(() => {
        // this.state = _.assignIn(this.state, {
        //   products: this.state.currentClientDetail.products,
        //   profile: this.state.currentClientDetail.profile,
        //   transactions: this.state.currentClientDetail.transactions,
        //   wallet: this.state.currentClientDetail.wallet,
        //   totalWallet: this.state.currentClientDetail.totalWallet,
        //   totalTransaction: this.state.currentClientDetail.totalTransaction,
        // })
        // this.setState({
        //   transactions: this.state.currentClientDetail.transactions,
        //   wallet: this.state.currentClientDetail.wallet,
        //   totalWallet: this.state.currentClientDetail.totalWallet,
        //   totalTransaction: this.state.currentClientDetail.totalTransaction,
        // })
      // }, 500);
    // }
  }

  render() {
    return (
      <Screen
        store={this.props.store}
        navigator={this.props.navigator}
        client={this.state.client}
        products={this.state.products}
        transactions={this.state.transactions}
        wallet={this.state.wallet}
        currentDetail={this.state.currentClientDetail}
        profile={this.state.profile}/>
    );
  }
}
