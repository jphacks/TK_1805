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
      <Article>
        <BackButtonContainer onClick={ () => this.props.history.goBack() }>×</BackButtonContainer>
        <FireStorageImage type="item" photo={this.item.photo} style={styles.img} />
          <ItemContainer>
          <ItemHeader>{ this.item.name }</ItemHeader>
          <DescContainer>
            <span>{ this.item.description }</span>
            <span>¥{ this.item.price }円(税抜き)</span>
          </DescContainer>
          <ListContainer>
            <ListItem>
              <ListLabel>
                <span>数量</span>
              </ListLabel>
              <ListValue>
                  <MathButton onClick={this.decrement.bind(this)}>-</MathButton>
                  <span>{ this.state.count }</span>
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
          <AddButton onClick={this.onClickAddItemButton.bind(this)}>追加する</AddButton>
        </ItemContainer>
      </Article>
    );
  }
}

const Article = styled.article`
  position: related;
`

const BackButtonContainer = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  background: lightgray;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  padding: 0;
`

const ItemHeader = styled.h1`
  color: #E46A6E;
`


const ItemContainer = styled.div`
  padding: 10px 30px;
`

const DescContainer = styled.div`
  display: flex;
  flex-direction: row;

  & > span {
    font-size: 10px
  }
`

const ListContainer = styled.ul`
  list-style: none;
  width: 320px;
  margin: 20px auto;
  padding: 0px;
  font-size: 20px;
`


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
`

const ListLabel = styled.div`
  font-size: 20px;
`

const ListValue = styled.div`
  width: 120px;
  display: flex;
  flex-direction: row;

  & > * {
    text-align: center;
    width: 100%;
  }
`

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
`


const AddButton = styled.button`
  position: absolute;
  bottom: 20px;
  margin: 0px auto;
  width: 320px;
  heigth: 30px
  background-color: #FF8100;
  font-size: 18px;
  border-radius: 15px;
  border-style: none;
  color: white;
`

const MathButton = styled.button`
  background-color: lightgray;
  font-weigth: bold;
  heigth: 40px;
  width: 40px;
  border-radius: 50%;
  padding: 0px;
`

const styles = {
  img: {
    width: "100%",
    height: "100%",
  }
}