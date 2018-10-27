import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Category } from '../types/category';
import FireStorageImage from '../components/FireStorageImage';
import MenuFooter from '../components/MenuFooter';
import { chunk } from '../lib/array';

type Props = {
  categories: Category[],
  init: (string) => void,
  storeName: string,
  match: any,
  tableId: string,
};

@inject(({ store }) => ({
  init: store.init,
  storeName: store.name,
  categories: store.categories,
  tableId: store.tableId,
}))
@observer
export default class Top extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.props.init(props.match.params.tableId);
  }

  render() {
    const list = chunk(this.props.categories.slice(), 2).map((pair, index) => (
      <Sub key={index}>
        <CategoryPanel key={pair[0].id} tableId={this.props.tableId} category={pair[0]} />
        <CategoryPanel key={pair[1].id} tableId={this.props.tableId} category={pair[1]} />
      </Sub>
    ));

    return (
      <main>
        <Header>
          { this.props.storeName }
        </Header>

        <Main>
          { list }
        </Main>

        <MenuFooter tableId={this.props.tableId} />
      </main>
    )
  }
}

const __CategoryPanelContainer = styled.div`
  width: 160px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const __CategoryPanelName = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-weight: bold;
  text-decoration: none;
  padding: 4px 0;

  &:visited {
    color: black;
    text-decoration: none;
  }
`;

const CategoryPanel = ({ tableId, category }) => (
  <Link to={`/tables/${tableId}/categories/${category.id}`} style={styles.link}>
    <__CategoryPanelContainer>
      <FireStorageImage type='category' photo={category.photo} style={styles.image} />
      <__CategoryPanelName>{category.name}</__CategoryPanelName>
    </__CategoryPanelContainer>
  </Link>
);

const Header = styled.header`
  width: 100%;
  box-sizing: border-box;
  padding: 26px 24px;
  font-size: 22px;
  font-weight: bold;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
`;

const Sub = styled.div`
  display: flex;
  padding: 0 16px;
  justify-content: space-between;
`;

const styles = {
  link: {
    marginBottom: 26,
    textDecoration: 'none',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  }
}
