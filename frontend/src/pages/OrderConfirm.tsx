import * as React from 'react';
import { Order } from '../types/order';
import { Item } from '../types/item';
import { inject, observer } from 'mobx-react';
import Header from '../components/Header';
import FireStorageImage from '../components/FireStorageImage';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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
    console.log(this.props.inbox.slice());

    const items = this.props.inbox.slice().map((order, index) => {
      const item = this.props.itemMap[order.itemId];

      if (!item) {
        return <div key={index} />;
      }

      return (
        <ItemCard
          key={index}
          count={order.count}
          tableId={this.props.tableId}
          item={item}
          style={styles}
        />
      );
    });

    return (
      <ArticleContainer>
        <Header title='注文確認' history={this.props.history} />

        <ItemsContainer>
          { items }
        </ItemsContainer>

        <AddButton onClick={this.onClickConfirmButton.bind(this)}>注文を確定する</AddButton>
      </ArticleContainer>
    );
  }
}

const ItemCard = ({ tableId, item, count, style }) => (
  <Link to={`/tables/${tableId}/items/${item.id}`}  style={style.a}>
     <ItemContainer>
      <FireStorageImage type='item' photo={item.photo} style={style.img}/>
      <ItemName>{ item.name }</ItemName>
      <CountCircle><p>{ count }</p></CountCircle>
    </ItemContainer>
  </Link>
);

const ArticleContainer = styled.article`
  position: related;
`


const ItemsContainer = styled.div`
  position: related;
  display: flex;
  flex-direction: column;
  padding: 10px 24px;
`

const ItemContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
`
const ItemName = styled.div`
  padding-left: 20px;
  color: orange;
`

const CountCircle = styled.div`
  position: absolute;
  right: 28px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: lightgray;
  display: flex;
  align-items: center;
  justify-content: center;
`

const styles = {
  img: {
    width: 60,
    height: 60
  },
  a: {
    textDecoration: "none"
  }
};

const AddButton = styled.button`
  position: absolute;
  bottom: 28px;
  width: 320px;
  background-color: #FF8100;
  border-style: none;
  color: white;
  right: calc((100% - 320px) / 2);
  font-weight: bold;
  padding: 6px 0;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  border-radius: 100px;
`;