import { observable, action, computed } from 'mobx';
import { Item } from '../types/item';
import { Category } from '../types/category';
import firebase from '../config/firebase';
import { arrayFromSnapshot } from '../lib/firestore';
import { DateTime } from 'luxon';

const db = firebase.firestore();

const URL_BASE = 'http://localhost:8880/v1';

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
  async init(tableId: string) {
    if (this.initialized) { return; }
    if (!tableId) { throw 'ERROR: tableId is not defined!' }

    this.tableId = tableId;

    const response = await fetch(`${URL_BASE}/store/groups?tableId=${tableId}`, {
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

    console.log(data);

    this.storeId = 'store-1';
    this.groupId = data.message.groupId;
    this.enterTime = DateTime.fromRFC2822(data.message.enteredAt);

    db.collection(`stores`).doc(this.storeId).get().then(doc => {
      const data = doc.data();

      if (data) {
        this.name = data.name;
      }
    });

    db.collection(`stores/${this.storeId}/categories`).orderBy('precedence').get().then(snapshot => {
      this.categories = arrayFromSnapshot(snapshot);
    });

    db.collection(`stores/${this.storeId}/items`).get().then(snapshot => {
      this.items = arrayFromSnapshot(snapshot);
    });

    console.debug('Initialized Store!');
  }
}

export default new Store();
