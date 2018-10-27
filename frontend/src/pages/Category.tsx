import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Item } from '../types/item';
import { Order } from '../types/order';
import FireStorageImage from '../components/FireStorageImage';
import { Category } from '../types/category';
import Header from '../components/Header';

type Props = {
  items: Item[],
  categories: Category[],
  match: any,
  init: (string) => void,
  tableId: string,
  inbox: Order[],
  history: any,
};

@inject(({ store, order }) => ({
  init: store.init,
  items: store.items,
  categories: store.categories,
  tableId: store.tableId,
  inbox: order.inbox,
}))
@observer
export default class CategoryPage extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.props.init(props.match.params.tableId);
  }

  get category() {
    return this.props.categories.find(category => category.id === this.categoryId);
  }

  get categoryId() {
    return this.props.match.params.categoryId;
  }

  get items() {
    return this.props.items.filter(item => item.categoryId === this.categoryId);
  }

  get itemToCountMap() {
    return this.props.inbox.reduce((hash, order) => {
      hash[order.itemId] = order.count;
      return hash;
    }, {});
  }

  render() {
    const items = this.items.map(item => (
      <ItemPanel key={item.id} tableId={this.props.tableId} item={item} count={this.itemToCountMap[item.id]} />
    ));

    return (
      <div>
        { this.category &&
          <Header title={this.category.name} history={this.props.history} />
        }

        <main>
          { items }
        </main>
      </div>
    );
  }
}

const ItemPanel = ({ tableId, item, count }) => (
  <Link to={`/tables/${tableId}/items/${item.id}`}>
    <FireStorageImage type='item' photo={item.photo} />
    <span>{ item.name }</span>
    <span>{ count }</span>{}
  </Link>
);

const HogeContainer = styled.header`
  display: flex;
`