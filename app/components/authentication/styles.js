import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2b323a',
    padding: 36
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: '#78B7FF',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 3
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center'
  },
  welcomeText: {
    paddingBottom: 20,
    marginBottom: 120
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 30,
  },
  welcomeSubTitle: {
    color: '#fff',
    fontSize: 18
  },
  forgotContainer: {
    paddingBottom: 12,
    alignSelf: 'stretch',
    marginTop: 12
  },
  forgot: {
    color: '#fff',
  },
});
