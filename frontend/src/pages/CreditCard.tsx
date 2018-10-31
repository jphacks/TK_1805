import * as React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Order } from '../types/order';
import Initializer from '../components/Initializer';
import Header from '../components/Header';
import MyStoreCheckout from '../components/MyStoreCheckout';
import Amount from '../components/Amount';
import CreditCardCaution from '../components/CreditCardCaution';

// const HOST_NAME = 'https://ee949b6c.ngrok.io';
const HOST_NAME = 'http://35.221.123.85:5000';

type Props = {
  itemMap: any,
  orders: Order[],
  uid: string,
  groupId: string,
  match: any,
  history: any,
};

@inject(({ store, order }) => ({
  itemMap: store.itemMap,
  orders: order.orders,
  uid: order.uid,
  groupId: store.groupId,
}))
@observer
export default class CreditCard extends React.Component<Props> {
  get amount() {
    return this.props.orders.slice().reduce((sum, order) => {
      const item = this.props.itemMap[order.itemId];

      if (!item) {
        return sum;
      }

      return sum + item.price * order.count;
    }, 0);
  }

  onCompletePayment() {
    this.props.history.push('/thankyou');

    // reset group id
  }

  render() {
    return (
      <Main>
        <Initializer match={this.props.match} />
        <Header title='クレジットカード' history={this.props.history} />

        <Amount amount={this.amount} style={{}} />

        <CreditCardCaution style={{}} />

        <MyStoreCheckout
          onCompletePayment={this.onCompletePayment.bind(this)}
          uid={this.props.uid}
          amount={this.amount}
          groupId={this.props.groupId}
        />
      </Main>
    );
  }
}

const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
