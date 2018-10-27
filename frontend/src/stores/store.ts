import { observable, action } from 'mobx';
import { Item } from '../types/item';
import { Category } from '../types/category';
import firebase from '../config/firebase';

const db = firebase.firestore();

const URL_BASE = 'http://35.221.123.85:5000/v1';

function arrayFromSnapshot(snapshot: firebase.firestore.QuerySnapshot) {
  let items: any[] = [];

  snapshot.forEach(item => {
    items.push({ ...item.data(), id: item.id });
  });

  return items;
}

class Store {
  @observable storeId: string = '';
  @observable tableId: string = '';
  @observable groupId: string = '';
  @observable name: string = '';
  @observable items: Item[] = [];
  @observable categories: Category[] = [];

  @action.bound
  async init(tableId: string) {
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
      console.log(snapshot);
      this.categories = arrayFromSnapshot(snapshot);
    });

    // db.collection(`stores/${this.storeId}/items`).get().then(snapshot => {
    //   this.items = arrayFromSnapshot(snapshot);
    // });
  }
}

export default new Store();
