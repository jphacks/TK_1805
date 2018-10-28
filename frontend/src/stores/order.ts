import { observable, action, computed } from 'mobx';
import { Order } from '../types/order';
import firebase, { db, auth } from '../config/firebase';
import { arrayFromSnapshot } from '../lib/firestore';
import { Interval } from 'luxon';

const TEN_SECONDS = 10 * 1000;

function validDate(start, end) {
  return Interval.fromDateTimes(start, end).toDuration().milliseconds < TEN_SECONDS;
}

class OrderStore {
  @observable inbox: Order[] = [];
  @observable orders: Order[] = [];
  @observable uid: string = '';
  unsubscribe: any = null;

  @action.bound
  init(storeId: string, groupId: string, notify: (ids: Order[]) => void) {
    if (this.unsubscribe) {
      return;
    }

    auth.signInAnonymously().then(data => {
      if (data.user) {
        this.uid = data.user.uid;
      }
    }).catch((e) => {
      console.error(e);
    });

    this.unsubscribe = db.collection(`stores/${storeId}/groups/${groupId}/orders`).onSnapshot(snapshot => {
      console.debug('Fetch new orders');

      const orders = arrayFromSnapshot(snapshot)
        .sort((a, b) => a.createdAt.toDate() - b.createdAt.toDate());
      const newOrders = orders.slice(this.orders.length)
        .filter(order => order.uid !== this.uid)
        .filter(order => validDate(order.createdAt.toDate(), new Date()));

      if (newOrders.length > 0) {
        console.debug(`Notify ${newOrders.length} orders`);
        notify(newOrders);
      }

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
      db.collection(`stores/${storeId}/groups/${groupId}/orders`).add({
        ...order,
        uid: this.uid,
        createdAt: firebase.firestore.Timestamp.now(),
      });
    }

    this.inbox = [];
  }
}

export default new OrderStore();
