import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Item } from '../types/item';
import { Order } from '../types/order';
import FireStorageImage from '../components/FireStorageImage';
import { Category } from '../types/category';
import Header from '../components/Header';
import MenuFooter from '../components/MenuFooter';

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
      <ItemPanel key={item.id} tableId={this.props.tableId} item={item} count={this.itemToCountMap[item.id]} style={style} />
    ));

    return (
      <div>
        { this.category &&
          <Header title={this.category.name} history={this.props.history} />
        }

        <MainContainer>
          { items }
        </MainContainer>
        <MenuFooter tableId={this.props.tableId} />
      </div>
    );
  }
}

const ItemPanel = ({ tableId, item, count, style}) => (
  <Link to={`/tables/${tableId}/items/${item.id}`} style={style.a} >
    <PanelContainer>
      <FireStorageImage type='item' photo={item.photo} style={style.img}/>
      <OverlayLabel>{ item.name }</OverlayLabel>
      { count &&
        <CountLabel><p>{ count }</p></CountLabel>
      }
    </PanelContainer>
  </Link>
);

const MainContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 4px 12px;
  display: flex;
  flex-wrap: wrap

  & > a {
    width: 50%;
  }
`;

const OverlayLabel = styled.div`
  position: absolute;
  bottom: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  width: calc(100% - 30px);
  color: white;
  padding-left: 10px;
  border-radius: 0 0 4px 4px;
  color: #FFFFFF;
  letter-spacing: 0.14px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.50);
`;

const PanelContainer = styled.div`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
`;

const CountLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
  width: 50px;
  height: 50px;
  background-color: orange;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;


  & > p {
    margin: 0px;
    font-weight: bold;
    font-size: 32px;
    opacity: 1.0;
  }
`;

const style = {
  a: {
    padding: 10,
    textDecoration: "none",
    boxSizing: "border-box",
    position: "relative",
  },
  img: {
    width: "100%",
    height: "100%",
  }
};
