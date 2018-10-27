import { observable, action } from 'mobx';
import { Order } from '../types/order';
import { db } from '../config/firebase';
import { arrayFromSnapshot } from '../lib/firestore';

class OrderStore {
  @observable inbox: Order[] = [];
  @observable orders: Order[] = [];
  unsubscribe: any = null;

  @action.bound
  init(storeId: string, groupId: string) {
    if (this.unsubscribe) {
      return;
    }

    this.unsubscribe = db.collection(`stores/${storeId}/groups/${groupId}/orders`).onSnapshot(snapshot => {
      // TODO: 差分だけ取ってきて通知したい
      // snapshot.docChanges.forEach(change => {
      //   if (change.type === 'added') {
      //     const orders = change.doc.data().orders;
      //     this.orders.push(orders);
      //   }
      // });

      const orders = arrayFromSnapshot(snapshot);
      const newOrders = orders.slice(this.orders.length);

      this.orders = orders;
    });

    console.debug('Initialized Order!');
  }

  @action.bound
  add(order) {
    console.debug(`ADD ORDER: ${JSON.stringify(order)}`);

    const index = this.inbox.findIndex(o => o.itemId === order.itemId);

    if (index === -1) {
      this.inbox.push(order);
    } else {
      this.inbox[index].count = order.count;
    }
  }

  @action.bound
  commit(storeId: string, groupId: string) {
    // TODO: 決済が終了していたら注文できないようにする

    for (let order of this.inbox) {
      db.collection(`stores/${storeId}/groups/${groupId}/orders`).add(order);
    }

    this.inbox = [];
  }
}

export default new OrderStore();
