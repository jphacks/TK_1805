import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Order } from '../types/order';
import { Item } from '../types/item';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

type Props = {
  itemMap: any,
  tableId: string,
  storeId: string,
  groupId: string,
  items: Item[],
  initStore: (tableId: string) => void,
  initOrder: (storeId: string, groupId: string) => void,
  orders: Order[],
  history: any,
  match: any,
};

@inject(({ store, order }) => ({
  initStore: store.init,
  initOrder: order.init,
  orders: order.orders,
  items: store.items,
  itemMap: store.itemMap,
  tableId: store.tableId,
  storeId: store.storeId,
  groupId: store.groupId,
}))
@observer
export default class OrderIndex extends React.Component<Props> {
  state = {
    showModal: false,
  };

  constructor(props) {
    super(props);

    this.props.initStore(this.props.match.params.tableId);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.storeId !== '' && nextProps.groupId !== '') {
      this.props.initOrder(nextProps.storeId, nextProps.groupId);
    }
  }

  get totalPrice() {
    return this.props.orders.reduce((sum, order) => {
      const item = this.props.itemMap[order.itemId];

      if (!item) {
        return sum;
      }

      return sum + item.price * order.count;
    }, 0);
  }

  onClickSelectPaymentMethod() {
    this.setState({ showModal: true });
  }

  render() {
    const items = this.props.orders.slice().map((order, index) => {
      const item = this.props.itemMap[order.itemId];

      if (!item) {
        return <div key={index} />;
      }

      return (
        <li key={index}>
          <Link to={`/tables/${this.props.tableId}/`}>
            { item.name }
          </Link>

          <span>
            x { order.count }
          </span>

          <span>
            { item.price * order.count }円
          </span>
        </li>
      );
    });

    return (
      <article>
        <Header title='注文一覧' history={this.props.history} />
        <ul>
          { items }
        </ul>

        <div>
          <span>小計</span>
          <span>¥{ this.totalPrice }円</span>
        </div>

        <button onClick={this.onClickSelectPaymentMethod.bind(this)}>
          お支払い方法を選択する
        </button>
      </article>
    );
  }
}
