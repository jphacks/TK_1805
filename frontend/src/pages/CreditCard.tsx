import * as React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Order } from '../types/order';
import Initializer from '../components/Initializer';
import Header from '../components/Header';
import stripe from '../config/stripe';
import { Elements } from 'react-stripe-elements';

import { withRouter } from 'react-router';
import MyStoreCheckout from '../components/MyStoreCheckout';

// const HOST_NAME = 'https://ee949b6c.ngrok.io';
const HOST_NAME = 'http://35.221.123.85:5000';

type Props = {
  itemMap: any,
  orders: Order[],
  uid: string,
  match: any,
  history: any,
};

@inject(({ store, order }) => ({
  itemMap: store.itemMap,
  orders: order.orders,
  uid: order.uid,
}))
@observer
export default class CreditCard extends React.Component<Props> {
  state = {
    number: '',
    exp_month: 11,
    exp_year: 2018,
    cvc: '',
    error: '',
  };

  get amount() {
    return this.props.orders.slice().reduce((sum, order) => {
      const item = this.props.itemMap[order.itemId];

      if (!item) {
        return sum;
      }

      return sum + item.price * order.count;
    }, 0);
  }

  render() {
    return (
      <Main>
        <Initializer match={this.props.match} />
        <Header title='クレジットカード' history={this.props.history} />

        <Amount>
          <p>小計</p>
          <p>{ this.amount }円</p>
        </Amount>

        <MyStoreCheckout uid={this.props.uid} amount={this.amount} />
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

const Amount = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 90%;
  padding: 10px;
  border: 1px solid lightgrey;
  border-radius: 4px;
  color: grey;
  font-weight: bold;

  & > p {
    margin: 0;
  }
`;
