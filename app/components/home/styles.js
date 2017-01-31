import { StyleSheet } from 'react-native';

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
    paddingTop: 32,
    paddingHorizontal: 24
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  },
  headerAndroid: {
    backgroundColor: '#2b323a',
    alignSelf: 'stretch',
    height: 54,
    paddingTop: 16,
    paddingHorizontal: 24
  },
  headerTextAndroid: {
    color: '#fff',
    fontSize: 18,
    paddingLeft: 50
  },
  menu: {
    position: 'absolute',
    left: 18,
    top: 27,
    zIndex: 1
  },
  menuAndroid: {
    position: 'absolute',
    left: 18,
    top: 14,
    zIndex: 1
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
    alignItems: 'center',
    alignSelf: 'stretch'
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
    fontSize: 24,
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
  button: {
    alignSelf: 'stretch',
    backgroundColor: '#78B7FF',
    paddingHorizontal: 6,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center'
  }
});
