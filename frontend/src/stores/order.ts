import { observable, action } from 'mobx';
import { Order } from '../types/order';
import { db } from '../config/firebase';

class OrderStore {
  @observable inbox: Order[] = [];
  @observable orders: Order[] = [];

  init(storeId: string, groupId: string) {
    db.collection(`stores/${storeId}/groups`).doc(groupId).onSnapshot(doc => {
      // TODO: 差分だけ取ってきて通知したい
      // snapshot.docChanges.forEach(change => {
      //   if (change.type === 'added') {
      //     const orders = change.doc.data().orders;
      //     this.orders.push(orders);
      //   }
      // });

      this.orders = (doc.data() as any).orders;
    });
  }

  // NOTE: action.bindを使わないと行けないかも
  @action
  add(order) {
    this.inbox.push(order);
  }

  // NOTE: action.bindを使わないと行けないかも
  @action
  commit(storeId, groupId) {
    // TODO: 決済が終了していたら注文できないようにする

    for (let order of this.inbox) {
      db.collection(`stores/${storeId}/groups/${groupId}/orders`).add(order);
    }
  }
}

export default new OrderStore();
