import * as React from 'react';
import { inject } from 'mobx-react';
import FireStorageImage from '../components/FireStorageImage';
import { Item } from '../types/item';
import { Order } from '../types/order';

type Props = {
  init: (string) => void,
  add: (Order) => void,
  items: Item[],
  match: any,
  history: any,
};

@inject(({ store, order }) => ({
  init: store.init,
  items: store.items,
  add: order.add,
}))
export default class ItemPage extends React.Component<Props> {
  state = {
    count: 1,
  };

  constructor(props) {
    super(props);

    this.props.init(props.match.params.tableId);
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  decrement() {
    this.setState({ count: Math.max(this.state.count - 1, 1) });
  }

  get itemId() {
    return this.props.match.params.itemId;
  }

  get item() {
    return this.props.items.find(item => item.id === this.itemId);
  }

  get totalPrice() {
    if (!this.item) {
      return 0;
    }

    return this.item.price * this.state.count;
  }

  onClickAddItemButton() {
    this.props.add({ itemId: this.itemId, count: this.state.count });
    this.props.history.goBack();
  }

  render() {
    if (!this.item) {
      return <div>Loading</div>;
    }

    return (
      <article>
        <FireStorageImage type="item" photo={this.item.photo} />
        <h1>{ this.item.name }</h1>
        <span>{ this.item.description }</span>
        <span>¥{ this.item.price }円(税抜き)</span>
        <ul>
          <li>
            <span>数量</span>
            <button onClick={this.decrement.bind(this)}>-</button>
            <span>{ this.state.count }</span>
            <button onClick={this.increment.bind(this)}>+</button>
          </li>
          <li>
            <span>価格</span>
            <span>¥{ this.totalPrice }円</span>
          </li>
        </ul>

        <button onClick={this.onClickAddItemButton.bind(this)}>
          追加する
        </button>
      </article>
    );
  }
}
