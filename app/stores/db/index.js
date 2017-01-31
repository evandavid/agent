import Realm from 'realm';
import AppSchema from './app';

export default class Schema {
  constructor() {
    let appSchema = AppSchema();
    this.realm =  new Realm({schema: [appSchema]});
  }
}
