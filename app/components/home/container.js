import React, { Component } from 'react';
import Screen from './screen';
import { Alert, BackAndroid } from 'react-native';

import * as appActions from '../../stores/app/actions';

let componentMounted = false;

export default class HomeContainer extends Component {
  constructor (props) {
    super(props);
    var data = props.store.getState().data;

    this.state = {
      ready: props.data.ready,
      email: null,
      app: props.store.getState().app,
      listData: {totalRecord: data.totalRecord, details: data.clientList},
      initial: data.clientList.length,
      hardrefresh: false
    };

    if (props.data.ready && !data.clientList.length) {
      this._getData({}, true);
    }
  }

  _getData = (_params, hardrefresh) => {
    var params = {},
        data = null,
        $this = this;

    params.filter = _params.filter || [];
    params.take = _params.take || 15;
    params.skip = _params.skip || 0;
    params.sort = _params.sort || [];
    data = JSON.stringify(params);

    fetch(this.state.app.backendUrl + 'customer/grid',
      { method: 'POST', body: data })
      .then(function(res) {
        return res.json();
      })
      .then(function(body) {
        if (componentMounted) {
          if (body.jsonError) {
            Alert.alert( 'Something went wrong', 'Ops, something went wrong. Please try again later.',
              [ {text: 'OK', onPress: () => { $this.setState({listData: [], hardrefresh: hardrefresh}); } } ]
            );
          } else $this.setState({listData: body, initial: (hardrefresh ? 15 : $this.state.initial + 15), hardrefresh: hardrefresh});
        }
      })
      .catch(function(err) {
        Alert.alert( 'Something went wrong', 'Ops, something went wrong. Please try again later.',
          [ {text: 'OK', onPress: () => { $this.setState({listData: [], hardrefresh: hardrefresh}); } } ]
        );
      })
      .done();
  }

  _selectClient = (data) => {
    this.props.navigator.push({id: 'client'});
    this.props.store.dispatch(appActions.changeClient(data));
    // setTimeout(() => {
    //   this.props.navigator.push({id: 'client'});
    // },10);
  }

  componentWillReceiveProps(newprops) {
    if (newprops.data.ready !== this.state.ready) {
      this.setState({ready: newprops.data.ready});
      if (newprops.data.ready) {
        this._getData({}, true);
      }
    }
  }

  componentWillMount() {
    // BackAndroid.removeEventListener('hardwareBackPress');
  }

  componentDidMount() {
    componentMounted = true;
  }

  componentWillUnmount () {
    componentMounted = false;
    BackAndroid.removeEventListener('hardwareBackPress');
  }

  render() {
    return (

      <Screen
        ready={this.state.ready}
        store={this.props.store}
        navigator={this.props.navigator}
        extra={{email: this.state.email, app: this.state.app}}
        data={this.state.listData}
        hardrefresh={this.state.hardrefresh}
        refresh={this._getData.bind(this)}
        initial={this.state.initial || 0}
        selectClient={this._selectClient}/>
    );
  }
}
