import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Category } from '../types/category';
import FireStorageImage from '../components/FireStorageImage';

type Props = {
  categories: Category[],
  init: (string) => void,
  storeName: string,
  match: any,
};

@inject(({ store }) => ({
  init: store.init,
  storeName: store.name,
  categories: store.categories,
}))
@observer
export default class Top extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.props.init(props.match.params.tableId);
  }

  render() {
    const list = this.props.categories.map(category => (
      <CategoryPanel key={category.id} category={category} />
    ));

    return (
      <div>
        <header>
          <span>
            { this.props.storeName }
          </span>
        </header>
        { list }
      </div>
    )
  }
}

const CategoryPanel = ({ category }) => (
  <a href={`categories/${category}`}>
    <FireStorageImage type='category' photo={category.photo} style={{ width: 100, height: 100 }} />
    <span>{category.name}</span>
  </a>
)
