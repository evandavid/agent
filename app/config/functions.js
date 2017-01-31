import * as appActions from '../stores/app/actions';
let screenOrientation = null;

export function onLayout (event, store) {
  var layout = event.nativeEvent.layout,
      _newScreenOrientation = layout.width > layout.height ? 'LANDSCAPE' : 'PORTRAIT',
      _initial = true;

  if (screenOrientation !== null && screenOrientation !== _newScreenOrientation) {
    _initial = false;
  }

  screenOrientation = _newScreenOrientation;
  // Orientation changed, broadcast to redux
  store.dispatch(appActions.changeOri(_initial, screenOrientation));
}

export function money (input) {
  var floatInstance = parseFloat(input),
      tmp = null;
  if (!isNaN(floatInstance)) {
    // round number
    tmp = String(floatInstance).split('.');

    if (tmp.length === 2 && tmp[1].length <= 4) {
      return floatInstance.toFixed(tmp[1].length).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    } else if (tmp.length === 2) {
      return floatInstance.toFixed(4).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
    return floatInstance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  return input;
}

export function nFormatter(num, digits) {
  digits = 1;
  num = parseFloat(num);
  if (isNaN(num)) num = 0;
  var si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9,  symbol: 'G' },
    { value: 1E6,  symbol: 'M' },
    { value: 1E3,  symbol: 'k' }
  ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
  for (i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
    }
  }
  return num.toFixed(digits).replace(rx, '$1');
}
