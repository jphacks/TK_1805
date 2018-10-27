import { observable, action, computed } from 'mobx';
import { Item } from '../types/item';
import { Category } from '../types/category';
import firebase from '../config/firebase';
import { arrayFromSnapshot } from '../lib/firestore';

const db = firebase.firestore();

const URL_BASE = 'http://35.221.123.85:5000/v1';

class Store {
  @observable storeId: string = '';
  @observable tableId: string = '';
  @observable groupId: string = '';
  @observable name: string = '';
  @observable items: Item[] = [];
  @observable categories: Category[] = [];

  @computed
  get initialized() {
    return !!this.storeId;
  }

  @computed
  get itemMap() {
    return this.items.slice().reduce((hash, item) => {
      hash[item.id] = item;
      return hash;
    }, {});
  }

  @action.bound
  async init(tableId: string) {
    if (this.initialized) { return; }
    if (!tableId) { throw 'ERROR: tableId is not defined!' }

    this.tableId = tableId;

    // const response = await fetch(`${URL_BASE}/store/groups?tableId=${tableId}`, {
    //   method: 'GET'
    // });

    // const data = await response.json();

    // this.storeId = data.storeId;
    // this.groupId = data.groupId;

    this.storeId = 'store-1';
    this.groupId = 'hoge';

    db.collection(`stores`).doc(this.storeId).get().then(doc => {
      const data = doc.data();

      if (data) {
        this.name = data.name;
      }
    });

    db.collection(`stores/${this.storeId}/categories`).get().then(snapshot => {
      this.categories = arrayFromSnapshot(snapshot);
    });

    db.collection(`stores/${this.storeId}/items`).get().then(snapshot => {
      this.items = arrayFromSnapshot(snapshot);
    });
  }
}

export default new Store();
