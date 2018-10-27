import * as React from 'react';
import { inject } from 'mobx-react';
import FireStorageImage from '../components/FireStorageImage';
import { Item } from '../types/item';
import { Order } from '../types/order';
import styled from 'styled-components';

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
      <Container>
        <FireStorageImage type="item" photo={this.item.photo} style={styles.img} />

        <CloseButton onClick={ () => this.props.history.goBack() }>
          ✕
        </CloseButton>

        <ItemContainer>
          <ItemHeader>{ this.item.name }</ItemHeader>
          <DescContainer>
            <Description>{ this.item.description }</Description>
            <Price>¥{ this.item.price }円(税抜き)</Price>
          </DescContainer>
          <ListContainer>
            <ListItem>
              <ListLabel>
                <span>数量</span>
              </ListLabel>
              <ListValue>
                <MathButton onClick={this.decrement.bind(this)}>-</MathButton>
                <CountNumber>{ this.state.count }</CountNumber>
                <MathButton onClick={this.increment.bind(this)}>+</MathButton>
              </ListValue>
            </ListItem>
            <ListItem>
              <ListLabel>
                <span>価格</span>
              </ListLabel>
              <ListValueWithUnderLine>
                <p className="currecny-label">¥</p>
                <p><span>{ this.totalPrice }</span>円</p>
              </ListValueWithUnderLine>
            </ListItem>
          </ListContainer>
        </ItemContainer>

        <AddButton onClick={this.onClickAddItemButton.bind(this)}>追加する</AddButton>
      </Container>
    );
  }
}

const Container = styled.article`
  flex-direction: column;
  display: flex;
  justify-content: center;
`;

const CloseButton = styled.div`
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  color: #9B9B9B;
  border-radius: 50%;

  &:hover {
    cursor: pointer;
  }
`;

const ItemHeader = styled.h1`
  font-size: 18px;
  color: #E46A6E;
`;

const ItemContainer = styled.div`
  padding: 10px 30px;
`;

const DescContainer = styled.div`
  display: flex;
  flex-direction: row;

  & > span {
    font-size: 10px
  }
`;

const Description = styled.div`
  color: #4A4A4A;
  font-size: 12px;
  padding-right: 20px;
`

const Price = styled.div`
  color: #4A4A4A;
  white-space: nowrap;
`;

const ListContainer = styled.ul`
  list-style: none;
  width: 320px;
  margin: 20px auto;
  padding: 0px;
  font-size: 20px;
`;

const ListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;

  & > div {
    margin-left: 56px;
  }

  &:not(:last-child) {
    margin-bottom: 12px;
  }
`;

const ListLabel = styled.div`
  font-size: 20px;
`;

const ListValue = styled.div`
  display: flex;
  flex-direction: row;
`;

const CountNumber = styled.span`
  padding: 0 20px;
  text-align: center;
  width: 25px;
`;

const ListValueWithUnderLine = styled.div`
  width: 120px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: solid 1px black;

  & > * {
    width: 100%;
  }

  & > p {
    margin: 0px;

    & > currecny-label {
      text-align: left;
    }
  }
`;

const AddButton = styled.button`
  position: absolute;
  bottom: 20px;
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

const MathButton = styled.div`
  background-color: #F0F0F0;
  font-weigtht: bold;
  height: 35px;
  width: 35px;
  border-radius: 50%;
  padding: 0px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const styles = {
  img: {
    width: "100%",
    height: "100%",
  }
};
