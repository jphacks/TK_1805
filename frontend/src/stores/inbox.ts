import { observable } from 'mobx';
import { Order } from '../types/order';

class Inbox {
  @observable orders: Order[] = [];
}

export default new Inbox();
