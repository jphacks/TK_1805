import * as React from 'react';
import { Order } from '../types/order';
import { Item } from '../types/item';
import { inject, observer } from 'mobx-react';
import Header from '../components/Header';
import FireStorageImage from '../components/FireStorageImage';
import { Link } from 'react-router-dom';

type Props = {
  inbox: Order[],
  items: Item[],
  tableId: string,
  storeId: string,
  groupId: string,
  itemMap: any,
  commit: (storeId: string, groupId: string) => void,
  history: any,
};

@inject(({ store, order }) => ({
  inbox: order.inbox,
  items: store.items,
  tableId: store.tableId,
  storeId: store.storeId,
  groupId: store.groupId,
  commit: order.commit,
  itemMap: store.itemMap,
}))
@observer
export default class OrderConfirm extends React.Component<Props> {
  onClickConfirmButton() {
    this.props.commit(this.props.storeId, this.props.groupId);
    this.props.history.goBack();
  }

  render() {
    const items = this.props.inbox.map((order, index) => {
      const item = this.props.itemMap[order.itemId];

      if (item) {
        return <div />;
      }

      return (
        <ItemCard
          key={index}
          count={order.count}
          tableId={this.props.tableId}
          item={this.props.itemMap[order.itemId]}
        />
      );
    });

    return (
      <article>
        <Header title='注文確認' history={this.props.history} />

        <div>
          { items }
        </div>

        <button onClick={this.onClickConfirmButton.bind(this)}>
          注文を確定する
        </button>
      </article>
    );
  }
}

const ItemCard = ({ tableId, item, count }) => (
  <Link to={`/tables/${tableId}/items/${item.id}`}>
    <FireStorageImage type='item' photo={item.photo} />
    <span>{ item.name }</span>
    <span>{ count }</span>
  </Link>
);
