import { observable } from 'mobx';
import { Item } from '../types/item';
import { Category } from '../types/category';
import firebase from '../config/firebase';

const db = firebase.firestore();

function arrayFromSnapshot(snapshot: firebase.firestore.QuerySnapshot) {
  let items: any[] = [];

  snapshot.forEach(item => items.push(item));

  return items;
}

class Store {
  @observable storeId: string = '';
  @observable items: Item[] = [];
  @observable categories: Category[] = [];

  init(storeId: string) {
    this.storeId = storeId;

    db.collection(`stores/${storeId}/items`).get().then(snapshot => {
      this.items = arrayFromSnapshot(snapshot);
    });

    db.collection(`stores/${storeId}/items`).get().then(snapshot => {
      this.categories = arrayFromSnapshot(snapshot);
    });
  }
}

export default new Store();