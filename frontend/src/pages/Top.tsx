import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Category } from '../types/category';
import FireStorageImage from '../components/FireStorageImage';
import MenuFooter from '../components/MenuFooter';
import { DateTime } from 'luxon';

type Props = {
  categories: Category[],
  init: (string) => void,
  storeName: string,
  match: any,
  tableId: string,
  enterTime: DateTime,
};

@inject(({ store }) => ({
  init: store.init,
  storeName: store.name,
  categories: store.categories,
  tableId: store.tableId,
  enterTime: store.enterTime,
}))
@observer
export default class Top extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.props.init(props.match.params.tableId);
  }

  render() {
    const items = this.props.categories.slice().map(category => (
      <CategoryPanel key={category.id} tableId={this.props.tableId} category={category} />
    ));

    return (
      <main>
        <Header>
          <StoreName>
            { this.props.storeName }
          </StoreName>

          <EnterTime>
            入店 { this.props.enterTime && this.props.enterTime.toFormat('T') }
          </EnterTime>
        </Header>

        <Main>
          { items }
        </Main>

        <MenuFooter tableId={this.props.tableId} />
      </main>
    )
  }
}

const __CategoryPanelContainer = styled.div`
  width: 100%;
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
  <Link to={`/tables/${tableId}/categories/${category.id}`} style={{ ...styles.link, boxSizing: 'border-box' }}>
    <__CategoryPanelContainer>
      <FireStorageImage type='category' photo={category.photo} style={styles.image} />
      <__CategoryPanelName>{category.name}</__CategoryPanelName>
    </__CategoryPanelContainer>
  </Link>
);

const StoreName = styled.span`
  font-size: 22px;
  font-weight: bold;
`;

const EnterTime = styled.span`
  font-size: 16px;
  color: grey;
`;

const Header = styled.header`
  width: 100%;
  box-sizing: border-box;
  padding: 26px 24px;
  justify-content: space-between;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const Main = styled.main`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 100px;
`;

const styles = {
  link: {
    marginBottom: 12,
    textDecoration: 'none',
    padding: 10,
    width: '50%',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  }
}
