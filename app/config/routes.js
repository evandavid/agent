import AuthContainer from '../components/authentication/container';
import HomeContainer from '../components/home/container';
import ClientContainer from '../components/clients/container';

import React, { PropTypes } from 'react';

// register all screens of the app (including internal ones)
export function registerScreens(route, navigator, store, data) {
  switch (route.id) {
    case 'login':
      return (<AuthContainer navigator={navigator} store={store} data={data}/>);
    case 'home':
      return (<HomeContainer navigator={navigator} store={store} data={data}/>);
    case 'client':
      return (<ClientContainer navigator={navigator} store={store} data={data}/>);
  }
}
