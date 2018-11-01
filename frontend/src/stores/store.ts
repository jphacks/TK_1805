import { observable, action, computed, extendObservable } from 'mobx';
import { Item } from '../types/item';
import { Category } from '../types/category';
import firebase, { storage } from '../config/firebase';
import { arrayFromSnapshot } from '../lib/firestore';
import { DateTime } from 'luxon';
import { STORE_API_URL_BASE } from '../config/api';

const db = firebase.firestore();

export class BadRequestError extends Error {
}

export class InternalServerError extends Error {
}

class Store {
  @observable storeId: string = '';
  @observable tableId: string = '';
  @observable groupId: string = '';
  @observable name: string = '';
  @observable items: Item[] = [];
  @observable categories: Category[] = [];
  @observable enterTime = null;

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
  async init(tableId: string, prefetch: any) {
    if (this.initialized) { return; }
    if (!tableId) { throw 'ERROR: tableId is not defined!' }

    this.tableId = tableId;

    const response = await fetch(`${STORE_API_URL_BASE}/store/groups?tableId=${tableId}`, {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) {
      console.error(`Fetch request failed ${JSON.stringify(response)}`);
    }

    let data: any = null;

    try {
      data = await response.json();
    } catch (e) {
      console.error(e.message);
      throw new InternalServerError('サーバーでエラーが発生しました。');
    }

    if (data.error) {
      console.error(data.error);
      throw new BadRequestError('正しいURLではありません。');
    }

    this.storeId = 'store-1';
    this.groupId = data.message.groupId;
    this.enterTime = DateTime.fromRFC2822(data.message.enteredAt);

    db.collection(`stores`).doc(this.storeId).get().then(doc => {
      const data = doc.data();

      if (data) {
        this.name = data.name;
      }
    });

    const storageRef = storage.ref();

    db.collection(`stores/${this.storeId}/categories`).orderBy('precedence').get().then(snapshot => {
      this.categories = arrayFromSnapshot(snapshot);

      for (let i = 0; i < this.categories.length; i++) {
        const { photo } = this.categories[i];
        const key = `categories/${photo.filename}`;

        storageRef.child(key).getDownloadURL().then(url => {
          this.categories[i].photo.url = url;
          prefetch(url);
        });
      }
    });

    db.collection(`stores/${this.storeId}/items`).get().then(snapshot => {
      this.items = arrayFromSnapshot(snapshot);

      for (let i = 0; i < this.items.length; i++) {
        const { photo } = this.items[i];
        const key = `items/${photo.filename}`;

        setTimeout(() => {
          storageRef.child(key).getDownloadURL().then(url => {
            this.items[i].photo.url = url;
            prefetch(url);
          });
        }, 3000);
      }
    });

    console.debug('Initialized Store!');
  }
}

export default new Store();
