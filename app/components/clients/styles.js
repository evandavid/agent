import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2b323a',
    padding: 36
  },
  sidebarHeader: {
    width: 270,
    height: 150,
    backgroundColor: '#383F47',
    paddingVertical: 24,
    paddingHorizontal: 12
  },
  sidebarMenuBox: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    // backgroundColor: 'transparent',
    // flex: 1
  },
  sidebarMenuItem: {
    position: 'relative',
    paddingVertical: 12,
    justifyContent: 'center',
    paddingLeft: 42
  },
  sidebarIcon: {
    position: 'absolute',
    left: 0,
    top: 10
  },
  usualText: {
    color: '#444',
    fontWeight: '500'
  },
  initialBox: {
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 50,
    zIndex: 2,
    backgroundColor: '#fff',
    marginBottom: 18
  },
  initialName: {
    color: '#383F47',
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  commonText: {
    color: '#fff',
    fontWeight: '500'
  },
  sidebarDetailHeaderText: {
    color: '#9EA5AD'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2b323a',
    alignSelf: 'stretch',
    height: 65,
    paddingTop: 26,
    paddingHorizontal: 24
  },
  headerText: {
    color: '#fff',
    fontSize: 14,
    paddingLeft: 12,
    paddingRight: 12
  },
  headerText2: {
    color: '#9EA5AD',
    fontSize: 11,
    paddingLeft: 12
  },
  headerAndroid: {
    backgroundColor: '#2b323a',
    alignSelf: 'stretch',
    height: 54,
    paddingTop: 10,
    paddingHorizontal: 24,
    paddingRight: 12
  },
  headerTextAndroid: {
    color: '#fff',
    fontSize: 16,
    paddingLeft: 12
  },
  headerTextAndroid2: {
    color: '#9EA5AD',
    fontSize: 13,
    paddingLeft: 12
  },
  menu: {
    position: 'absolute',
    left: 18,
    top: 27,
    zIndex: 1,
    width: 40
  },
  menuAndroid: {
    position: 'absolute',
    left: 18,
    top: 14,
    zIndex: 1,
    width: 40
  },
  seperator: {
    backgroundColor: '#DEE5ED',
    height: 1,
    alignSelf: 'stretch'
  },
  rowItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  name: {
    fontSize: 14,
    fontWeight: '500'
  },
  detail: {
    color: '#777',
    fontSize: 13
  },
  icon: {
    height: 50,
    width: 50,
    backgroundColor: '#2b323a',
    borderRadius: 50,
    justifyContent: 'center'
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontWeight: '300'
  },
  sidebar: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 1
  },
  sidebarContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width: 270,
    position: 'absolute',
    left: -270,
    top: 0,
    bottom: 0,
    zIndex: 1
  },
  headerBox: {
    flexDirection: 'row',
    marginRight: 80
  },
  headerIcon: {
    marginLeft: 50,
    marginTop: Platform.OS === 'ios' ? 0 : 1,
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center'
  },
  headerHeading: {
    alignSelf: 'stretch'
  },
  headerIconText: {
    backgroundColor: 'transparent',
    fontSize: 16,
    textAlign: 'center',
    color: '#2b323a'
  },
  headerIconTextAndroid: {
    backgroundColor: 'transparent',
    fontSize: 18,
    textAlign: 'center',
    color: '#2b323a'
  },
  body: {
    backgroundColor: '#efefef',
    flex: 1
  },
  iosBody: {
    paddingBottom: 50
  },
  androBody: {
    paddingTop: 35
  },
  pagerNavIos: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#efefef',
    bottom: 0,
    height: 50,
    left: 0,
    right: 0
  },
  pagerNavAndro: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#2b323a',
    top: 54,
    height: 35,
    left: 0,
    right: 0
  },
  menuNav: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  pagerTextIos: {
    fontSize: 12
  },
  pagerTextAndro: {
    fontSize: 14
  },
  profile: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    backgroundColor: '#fff'
  },

  detailsName: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8
  },
  titleName: {
    fontSize: 9,
    fontWeight: '500'
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: '#78B7FF',
    paddingHorizontal: 6,
    paddingVertical: 14,
    width: 200
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center'
  }
});
