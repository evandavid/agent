import React, { Component } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text, Platform, PanResponder,
  ListView, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import styles from './styles';
import Input from '../input';
import * as functions from '../../config/functions';
import Product from './products';
import Transaction from './transaction';
import Wallet from './wallet';
import * as dataActions from '../../stores/data/actions';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      screenWidth = Dimensions.get("window").width,
      currentValue = null,
      timeoutInstance = null,
      initialState = true,
      movingToRight = false,
      platform = Platform.OS,
      activeColor = null,
      deactiveColor = null,
      mounted = false,
      intervalInstance = null,
      pageVisibility = {1: true, 2: false, 3: false},
      tmInstance = null;

export default class ClientScreen extends Component {
  constructor (props) {
    super(props);

    if (platform === 'ios') {
      deactiveColor = '#999';
      activeColor = '#333';
    } else {
      deactiveColor = '#9EA5AD';
      activeColor = '#fff';
    }

    this.state = {
      dataSource: ds.cloneWithRows(['product', 'transaction', 'wallet']),
      horizontalScrolling: true,
      listkey: (new Date()).getTime(),
      activeTab: 0,
      products: props.products || [],
      transactions: props.transactions || [],
      wallet: props.wallet || [],
      detailsOpened: false,
      totalTransaction: 0,
      totalWallet: 0,
      userDetail: {}
    }
    currentValue =  JSON.parse(JSON.stringify(props.store.getState().app));
    props.store.subscribe(this._handleChange.bind(this));
  }

  _handleChange = () => {
    var newValue = JSON.parse(JSON.stringify(this.props.store.getState().app));
    if (newValue.orientation !== currentValue.orientation && !newValue.changesOnFirstLoad) {
      // need to rerender list because of orientation changes
      currentValue = JSON.parse(JSON.stringify(newValue));;
      screenWidth = Dimensions.get("window").width;
      this.setState({listkey: (new Date()).getTime()});
    }
  }

  _calculateDegree = (start, end) => {
    var deltaX = end.x - start.x,
        deltaY = end.y - start.y,
        rad = Math.atan2(deltaY, deltaX),
        deg = rad * (180 / Math.PI);

    return deg;
  }

  _detectPageChanged = (android) => {
    if (initialState && !android) {
      initialState = false;
    } else {
      // on scroll end
      var offset = this.refs.bodyPage.scrollProperties.offset,
          visibleLength = this.refs.bodyPage.scrollProperties.visibleLength;

      if (mounted) {
        if (offset < visibleLength) {
          this.setState({activeTab: 0});
          pageVisibility[1] = true;
        }
        else if (offset > visibleLength) {
          this.setState({activeTab: 2});
          if (!pageVisibility[3]){
            pageVisibility[3] = true;
            this.props.store.dispatch(dataActions.updateClientWalletTime(this.props.client.id));
          }
        }
        else {
          this.setState({activeTab: 1});
          if (!pageVisibility[2]) {
            pageVisibility[2] = true;
            this.props.store.dispatch(dataActions.updateClientTransactionTime(this.props.client.id));
          }
        }
      }
    }
  }

  _onChangeVisibleRows = () => {
    if (platform === 'ios') this._detectPageChanged();
  }

  _onScroll = () => {
    clearTimeout(tmInstance);
    tmInstance = setTimeout(() => {
      if (platform !== 'ios') {
        this._detectPageChanged(true);
      }
    }, 20);
  }

  _renderPage = (row) => {
    switch (row) {
      case 'product':
        return (
          <View style={{backgroundColor: '#fff', width: screenWidth, flex: 1}}>
            <Product
              visibility={pageVisibility[1]}
              data={this.state.products}
            />
          </View>
        );
        break;
      case 'transaction':
        return (
          <View style={{backgroundColor: '#fff', width: screenWidth, flex: 1}}>
            <Transaction
              currentDetail={this.props.currentDetail}
              store={this.props.store}
              visibility={pageVisibility[2]}
              data={this.state.transactions}
              total={this.state.totalTransaction}
              clientid={this.props.client.id}
            />
          </View>
        );
        break;
      case 'wallet':
        return (
          <View style={{backgroundColor: '#fff', width: screenWidth, flex: 1}}>
            <Wallet
              currentDetail={this.props.currentDetail}
              store={this.props.store}
              visibility={pageVisibility[2]}
              data={this.state.wallet}
              total={this.state.totalWallet}
              clientid={this.props.client.id}
            />
          </View>
        );
        break;
      default:
        return null;
    }
  }

  _renderNavIcon = (name, idx) => {
    if (platform === 'ios')
      return <Icon name={name} size={20} color={this.state.activeTab === idx ? activeColor : deactiveColor} />;
    return null;
  }

  _showProfile = () => {
    return (
      <ScrollView style={{flex: 1}}>
        {this._switchView()}
      </ScrollView>
    )
  }

  _switchView = () => {
    if (!this.state.userDetail) this.state.userDetail = {};
    if (!this.state.userDetail.investorProfile) return this._showInsti();
    else return this._showPersonal();
  }

  _showPersonal = () => {
    if (!this.state.userDetail.investorProfile) this.state.userDetail.investorProfile = {};
    if (!this.state.userDetail.workProfile) this.state.userDetail.workProfile = {};
    if (!this.state.userDetail.bankProfile) this.state.userDetail.bankProfile = {};
    if (!this.state.userDetail.investReason) this.state.userDetail.investReason = {};
    if (!this.state.userDetail.investorsRiskProfile) this.state.userDetail.investorsRiskProfile = {};
    return (
      <View style={{paddingVertical: 12, paddingHorizontal: 24, flex: 1}}>
        <Text numberOfLines={1} style={[styles.detailsName, {fontWeight: '700'}]}>
          Personal Information
        </Text>

        <Text style={styles.titleName}>First Name</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.namaDepanInd}
        </Text>

        <Text style={styles.titleName}>Middle Name</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.namaTengahInd}
        </Text>

        <Text style={styles.titleName}>Last Name</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.namaBelakangInd}
        </Text>

        <Text style={styles.titleName}>Identity</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.identitasInd1}
        </Text>

        <Text style={styles.titleName}>Identity Number</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.noIdentitasInd1}
        </Text>

        <Text style={styles.titleName}>Registration Date</Text>
        <Text style={[styles.detailsName]}>
          {moment(this.state.userDetail.investorProfile.registrationDateIdentitasInd1).format("MMMM D, YYYY")}
        </Text>

        <Text style={styles.titleName}>Expiration Date</Text>
        <Text style={[styles.detailsName]}>
          {moment(this.state.userDetail.investorProfile.expiredDateIdentitasInd1).format("MMMM D, YYYY")}
        </Text>

        <Text style={styles.titleName}>NPWP Number</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.npwp}
        </Text>

        <Text style={styles.titleName}>NPWP Registration Date</Text>
        <Text style={[styles.detailsName]}>
          {moment(this.state.userDetail.investorProfile.registrationNPWP).format("MMMM D, YYYY")}
        </Text>

        <Text style={styles.titleName}>Nationality</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.nationality}
        </Text>

        <Text style={styles.titleName}>Place of Birth</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.tempatLahir}
        </Text>

        <Text style={styles.titleName}>Date of Birth</Text>
        <Text style={[styles.detailsName]}>
          {moment(this.state.userDetail.investorProfile.tanggalLahir).format("MMMM D, YYYY")}
        </Text>

        <Text style={styles.titleName}>Country of Birth</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.countryOfBirth}
        </Text>

        <Text style={styles.titleName}>Gender</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.jenisKelamin}
        </Text>

        <Text style={styles.titleName}>Marital Status</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.statusPerkawinan}
        </Text>

        <Text style={styles.titleName}>Mother Maiden Name</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.motherMaidenName}
        </Text>

        <Text style={styles.titleName}>Education</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.pendidikan}
        </Text>

        <Text style={styles.titleName}>Religion</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.agama}
        </Text>

        <Text style={styles.titleName}>Address</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.alamatInd1}
        </Text>

        <Text style={styles.titleName}>City</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.kodeKotaInd1}
        </Text>

        <Text style={styles.titleName}>Postal Code</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.kodePosInd1}
        </Text>

        <Text style={styles.titleName}>Country</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.negara}
        </Text>

        <Text style={styles.titleName}>Email Address</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.email}
        </Text>

        <Text style={styles.titleName}>Mobile Phone</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.countryCodeTeleponSelular}{this.state.userDetail.investorProfile.teleponSelular}
        </Text>

        <Text style={styles.titleName}>Phone Number</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.countryCodeTeleponRumah}{this.state.userDetail.investorProfile.teleponRumah}
        </Text>

        <Text style={styles.titleName}>Fax Number</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorProfile.countryCodeFax}{this.state.userDetail.investorProfile.fax}
        </Text>

        <Text numberOfLines={1} style={[styles.detailsName, {fontWeight: '700', marginTop: 12}]}>
          Job Information
        </Text>

        <Text style={styles.titleName}>Job</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.workProfile.pekerjaan}
        </Text>

        <Text style={styles.titleName}>Income</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.workProfile.penghasilanInd}
        </Text>

        <Text style={styles.titleName}>Source of Income</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.workProfile.sumberDanaInd}
        </Text>

        <Text numberOfLines={1} style={[styles.detailsName, {fontWeight: '700', marginTop: 12}]}>
          Bank Reference
        </Text>

        { [1,2,3].map((n) => {
          if (this.state.userDetail.bankProfile['bankBranchName'+n]) {
            return (
              <View key={n}>
                <Text style={[styles.detailsName, {fontWeight: '500', fontSize: 12, marginTop: n == 1 ? 0: 6}]}>Bank #{n}</Text>

                <Text style={styles.titleName}>Bank Name</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.bankProfile['namaBank'+n]}
                </Text>

                <Text style={styles.titleName}>Bank Branch Name</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.bankProfile['bankBranchName'+n]}
                </Text>

                <Text style={styles.titleName}>Bank Account Number</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.bankProfile['nomorRekening'+n]}
                </Text>

                <Text style={styles.titleName}>Bank Account Name</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.bankProfile['namaNasabah'+n]}
                </Text>

                <Text style={styles.titleName}>Currency</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.bankProfile['mataUang'+n]}
                </Text>
              </View>
            );
          } else return null;
        }) }

        <Text numberOfLines={1} style={[styles.detailsName, {fontWeight: '700', marginTop: 12}]}>
          Investment Objective
        </Text>

        <Text style={styles.titleName}>Purpose of Investment</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investReason.maksudTujuanInd}
        </Text>

        <Text numberOfLines={1} style={[styles.detailsName, {fontWeight: '700', marginTop: 12}]}>
          Risk Profile
        </Text>

        <Text style={styles.titleName}>Risk Profile</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorsRiskProfile.investorsRiskProfileId}
        </Text>
      </View>
    )
  }

  _showInsti = () => {
    if (!this.state.userDetail.companyProfile) this.state.userDetail.companyProfile = {};
    if (!this.state.userDetail.officerData) this.state.userDetail.officerData = {};
    if (!this.state.userDetail.bankProfileIns) this.state.userDetail.bankProfileIns = {};
    if (!this.state.userDetail.investReasonIns) this.state.userDetail.investReasonIns = {};
    if (!this.state.userDetail.investorsRiskProfileIns) this.state.userDetail.investorsRiskProfileIns = {};

    return (
      <View style={{paddingVertical: 12, paddingHorizontal: 24, flex: 1}}>
        <Text numberOfLines={1} style={[styles.detailsName, {fontWeight: '700'}]}>
          Company Information
        </Text>

        <Text style={styles.titleName}>Company Name</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.namaPerusahaan}
        </Text>

        <Text style={styles.titleName}>Domicile</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.domisili}
        </Text>

        <Text style={styles.titleName}>Type</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.tipe}
        </Text>

        <Text style={styles.titleName}>Characteristic</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.karakteristik}
        </Text>

        <Text style={styles.titleName}>NPWP Number</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.npwp}
        </Text>

        <Text style={styles.titleName}>NPWP Registration Date</Text>
        <Text style={[styles.detailsName]}>
          {moment(this.state.userDetail.companyProfile.registrationNPWP).format("MMMM D, YYYY")}
        </Text>

        <Text style={styles.titleName}>SKD Number</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.noSKD}
        </Text>

        <Text style={styles.titleName}>SKD Expiration Date</Text>
        <Text style={[styles.detailsName]}>
          {moment(this.state.userDetail.companyProfile.expiredDateSKD).format("MMMM D, YYYY")}
        </Text>

        <Text style={styles.titleName}>SIUP Number</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.nomorSIUP}
        </Text>

        <Text style={styles.titleName}>Company Income</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.penghasilanInstitusi}
        </Text>

        <Text style={styles.titleName}>Company Source Of Income</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.sumberDanaInstitusi}
        </Text>

        <Text style={styles.titleName}>Address</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.alamatPerusahaan}
        </Text>

        <Text style={styles.titleName}>City</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.kodeKotaIns}
        </Text>

        <Text style={styles.titleName}>Postal Code</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.kodePosIns}
        </Text>

        <Text style={styles.titleName}>Country</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.negara}
        </Text>

        <Text style={styles.titleName}>Company Established Location</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.lokasiBerdiri}
        </Text>

        <Text style={styles.titleName}>Establishment Date</Text>
        <Text style={[styles.detailsName]}>
          {moment(this.state.userDetail.companyProfile.tanggalBerdiri).format("MMMM D, YYYY")}
        </Text>

        <Text style={styles.titleName}>Email Address</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.email}
        </Text>

        <Text style={styles.titleName}>Bussiness Phone Number</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.countryCodeTeleponBisnis}{this.state.userDetail.companyProfile.teleponBisnis}
        </Text>

        <Text style={styles.titleName}>Fax Number</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.companyProfile.countryCodeFax}{this.state.userDetail.companyProfile.fax}
        </Text>

        <Text numberOfLines={1} style={[styles.detailsName, {fontWeight: '700', marginTop: 12}]}>
          Officer Data
        </Text>

        { [1,2,3,4].map((n) => {
          if (this.state.userDetail.officerData['namaDepanIns'+n]) {
            return (
              <View key={n}>
                <Text style={[styles.detailsName, {fontWeight: '500', fontSize: 12, marginTop: n == 1 ? 0: 6}]}>Office #{n}</Text>

                <Text style={styles.titleName}>First Name</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.officerData['namaDepanIns'+n]}
                </Text>

                <Text style={styles.titleName}>Middle Name</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.officerData['namaTengahIns'+n]}
                </Text>

                <Text style={styles.titleName}>Last Name</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.officerData['namaBelakangIns'+n]}
                </Text>

                <Text style={styles.titleName}>Position</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.officerData['jabatan'+n]}
                </Text>

                <Text style={styles.titleName}>Identity</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.officerData['identitasIns'+n+'1']}
                </Text>

                <Text style={styles.titleName}>Identity Number</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.officerData['noIdentitasIns'+n+'1']}
                </Text>

                <Text style={styles.titleName}>Registration Date</Text>
                <Text style={[styles.detailsName]}>
                  {moment(this.state.userDetail.officerData['registrationDateIdentitasIns'+n+'1'] ).format("MMMM D, YYYY")}
                </Text>

                <Text style={styles.titleName}>Expiration Date</Text>
                <Text style={[styles.detailsName]}>
                  {moment(this.state.userDetail.officerData['expiredDateIdentitasIns'+n+'1'] ).format("MMMM D, YYYY")}
                </Text>

              </View>
            );
          } else return null;
        }) }

        <Text numberOfLines={1} style={[styles.detailsName, {fontWeight: '700', marginTop: 12}]}>
          Bank Reference
        </Text>

        { [1,2,3].map((n) => {
          if (this.state.userDetail.bankProfileIns['bankBranchName'+n]) {
            return (
              <View key={n}>
                <Text style={[styles.detailsName, {fontWeight: '500', fontSize: 12, marginTop: n == 1 ? 0: 6}]}>Bank #{n}</Text>

                <Text style={styles.titleName}>Bank Name</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.bankProfileIns['namaBank'+n]}
                </Text>

                <Text style={styles.titleName}>Bank Branch Name</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.bankProfileIns['bankBranchName'+n]}
                </Text>

                <Text style={styles.titleName}>Bank Account Number</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.bankProfileIns['nomorRekening'+n]}
                </Text>

                <Text style={styles.titleName}>Bank Account Name</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.bankProfileIns['namaNasabah'+n]}
                </Text>

                <Text style={styles.titleName}>Currency</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.bankProfileIns['mataUang'+n]}
                </Text>
              </View>
            );
          } else return null;
        }) }

        <Text style={[styles.detailsName, {fontWeight: '500', fontSize: 12, marginTop: 6}]}>Assets & Profit</Text>

        { [1,2,3].map((n) => {
          if (this.state.userDetail.bankProfileIns['bankBranchName'+n]) {
            return (
              <View key={n+'2'}>
                <Text style={styles.titleName}>Assets Last {n} Year</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.bankProfileIns['assetFor'+n+'Year']}
                </Text>
              </View>
            );
          } else return null;
        }) }

        { [1,2,3].map((n) => {
          if (this.state.userDetail.bankProfileIns['bankBranchName'+n]) {
            return (
              <View key={n+'1'}>
                <Text style={styles.titleName}>Profit Last {n} Year</Text>
                <Text style={[styles.detailsName]}>
                  {this.state.userDetail.bankProfileIns['operatingProfitFor'+n+'Year']}
                </Text>
              </View>
            );
          } else return null;
        }) }

        <Text numberOfLines={1} style={[styles.detailsName, {fontWeight: '700', marginTop: 12}]}>
          Investment Objective
        </Text>

        <Text style={styles.titleName}>Purpose of Investment</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investReasonIns.maksudTujuanInstitusi == 5 ? this.state.userDetail.investReasonIns.maksudTujuanLain : this.state.userDetail.investReasonIns.maksudTujuanInstitusi}
        </Text>

        <Text numberOfLines={1} style={[styles.detailsName, {fontWeight: '700', marginTop: 12}]}>
          Risk Profile
        </Text>

        <Text style={styles.titleName}>Risk Profile</Text>
        <Text style={[styles.detailsName]}>
          {this.state.userDetail.investorsRiskProfileIns.investorsRiskProfileId}
        </Text>
      </View>
    );
  }

  componentWillUnmount() {
    mounted = false;
    pageVisibility = {1: true, 2: false, 3: false};
    this.setState({activeTab: 0});
  }

  componentWillMount() {
    var initial = null;

    // handle swipe from side of screen to reveal sidebar
    // this._panResponder = PanResponder.create({
    //   onMoveShouldSetPanResponder:(evt, gs) => {
    //     if (initial == null) {
    //       initial = { x: gs.moveX, y: gs.moveY }
    //     } else {
    //       var deg = this._calculateDegree(initial, { x: gs.moveX, y: gs.moveY }),
    //           condition1 = (deg >= 0 && deg <= 30),
    //           condition2 = (deg <= 0 && deg >= -30),
    //           condition3 = (deg >= 150 && deg <= 180),
    //           condition4 = (deg <= -150),
    //           left = initial.x >= gs.moveX,
    //           right = initial.x < gs.moveX;
    //
    //       if (condition1 || condition2 || condition3 || condition4) {
    //         // horizontal move
    //         if (right) movingToRight = true;
    //         if (left) movingToRight = false;
    //         // console.log(' ==== moving horizontal ====', initial, { x: gs.moveX, y: gs.moveY });
    //       }
    //       setTimeout(() => {initial = null}, 500);
    //     }
    //   }
    // });
  }

  componentDidMount() {
    mounted = true;
  }

  componentWillReceiveProps(newprops) {
    // check for products
    if (newprops.products && newprops.products && newprops.products.length && this.state.products.length !== newprops.products.length) {
      this.setState({products: newprops.products, listkey: (new Date()).getTime() });
    }

    if (newprops.transactions && this.state.transactions.length !== newprops.transactions.length) {
      this.state.transactions = newprops.transactions;
      this.state.totalTransaction = newprops.currentDetail.totalTransaction;
    }

    if (newprops.wallet && this.state.wallet.length !== newprops.wallet.length) {
      this.state.wallet = newprops.wallet;
      this.state.totalWallet = newprops.currentDetail.totalWallet;
    }

    this.state.userDetail = newprops.profile;
  }

  render() {
    return (
      <View style={styles.container} onLayout={(event) => { functions.onLayout(event, this.props.store)}}>
        <View tag={'header'} style={platform === 'ios' ? styles.header : styles.headerAndroid}>
          <TouchableOpacity
            style={platform === 'ios' ? styles.menu : styles.menuAndroid}
            onPress={() => {setTimeout(() => {this.props.navigator.pop();}, 100)}}>
            <View>
              <Icon name={'md-arrow-back'} size={30} color={'#fff'} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({detailsOpened: true})}>
            <View style={styles.headerBox}>
              <View style={styles.headerIcon}>
                <Text style={platform === 'ios' ? styles.headerIconText : styles.headerIconTextAndroid}>
                  {this.props.client.name ? this.props.client.name[0]: ''}
                </Text>
              </View>
              <View style={styles.headerHeading}>
                <Text numberOfLines={1} style={platform === 'ios' ? styles.headerText : styles.headerTextAndroid}>
                  {this.props.client.name}
                </Text>
                <Text style={platform === 'ios' ? styles.headerText2 : styles.headerTextAndroid2}>Balance: {functions.money(this.props.client.balance)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View tag={'body'} style={[styles.body, platform === 'ios' ? styles.iosBody : styles.androBody]}   >
          <ListView
            ref={'bodyPage'}
            key={this.state.listkey}
            dataSource={this.state.dataSource}
            horizontal={true}
            pagingEnabled={true}
            alwaysBounceHorizontal={false}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            renderRow={this._renderPage}
            onScroll={this._onScroll}
            onChangeVisibleRows={this._onChangeVisibleRows}
          />
        </View>

        <View tag={'pagerNav'}
          style={platform === 'ios' ? styles.pagerNavIos : styles.pagerNavAndro}>
          <TouchableOpacity style={{flex: 1}} onPress={() => {this.setState({activeTab: 0});this.refs.bodyPage.scrollTo({x: 0 * screenWidth})}}>
            <View style={styles.menuNav}>
              {this._renderNavIcon('md-paper', 0)}
              <Text style={[platform === 'ios' ? styles.pagerTextIos : styles.pagerTextAndro, {color: this.state.activeTab === 0 ? activeColor : deactiveColor}]}> Products </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1}} onPress={() => {this.setState({activeTab: 1});this.refs.bodyPage.scrollTo({x: 1 * screenWidth})}}>
            <View style={styles.menuNav}>
              {this._renderNavIcon('md-basket', 1)}
              <Text style={[platform === 'ios' ? styles.pagerTextIos : styles.pagerTextAndro, {color: this.state.activeTab === 1 ? activeColor : deactiveColor}]}> Transactions </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1}} onPress={() => {this.setState({activeTab: 2});this.refs.bodyPage.scrollTo({x: 2 * screenWidth})}}>
            <View style={styles.menuNav}>
              {this._renderNavIcon('md-briefcase', 2)}
              <Text style={[platform === 'ios' ? styles.pagerTextIos : styles.pagerTextAndro, {color: this.state.activeTab === 2 ? activeColor : deactiveColor}]}> Wallet </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View tag={'profile'} style={[styles.profile, {zIndex: this.state.detailsOpened ? 3 : -1, flex: 1}]}>
          <View tag={'header'} style={[platform === 'ios' ? styles.header : styles.headerAndroid, {height: platform === 'ios' ? 130 : 120}]}>
            <TouchableOpacity
              style={platform === 'ios' ? styles.menu : styles.menuAndroid}
              onPress={() => this.setState({detailsOpened: false})}>
              <View>
                <Icon name={'md-arrow-back'} size={30} color={'#fff'} />
              </View>
            </TouchableOpacity>
            <View>
              <View style={[styles.headerBox, {marginRight: 24}]}>
                <View style={[styles.headerIcon, {marginTop: 52, marginLeft: 0, width: 40, height: 40}]}>
                  <Text style={platform === 'ios' ? styles.headerIconText : styles.headerIconTextAndroid}>
                    {this.props.client.name ? this.props.client.name[0]: ''}
                  </Text>
                </View>
                <View style={[styles.headerHeading,{paddingTop: 55}]}>
                  <Text numberOfLines={1} style={platform === 'ios' ? styles.headerText : styles.headerTextAndroid}>
                    {this.props.client.name}
                  </Text>
                  <Text style={platform === 'ios' ? styles.headerText2 : styles.headerTextAndroid2}>Balance: {functions.money(this.props.client.balance)}</Text>
                </View>
              </View>
            </View>
          </View>

          {this._showProfile()}

        </View>
      </View>
    );
  }
}
