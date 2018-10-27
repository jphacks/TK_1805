import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Item } from '../types/item';
import FireStorageImage from '../components/FireStorageImage';
import { Category } from '../types/category';

type Props = {
  items: Item[],
  categories: Category[],
  match: any,
  init: (string) => void,
};

@inject(({ store }) => ({
  init: store.init,
  items: store.items,
  categories: store.categories,
}))
@observer
export default class CategoryPage extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.props.init(props.match.params.tableId);

    console.log('CategoryPage')
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

  render() {
    const items = this.items.map(item => (
      <ItemPanel key={item.id} item={item} />
    ));

    return (
      <div>
        <header>
          <span>
            { this.category && this.category.name }
          </span>
        </header>

        <main>
          { items }
        </main>
      </div>
    );
  }
}

const ItemPanel = ({ item }) => (
  <Link to={`items/${item.id}`}>
    <FireStorageImage type='item' photo={item.photo} />
    <span>{ item.name }</span>
  </Link>
);
