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
import Amount from '../components/Amount';

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

        <Caution>
          こちらはテスト環境の入力画面です。
          テスト環境では本物のクレジットカードの情報は利用できません。
          代わりに次の情報をご入力ください。

          <br />
          <br />

          カード番号: 4242 4242 4242 4242 <br />
          有効期限: 2038年12月 <br />
          CVC: 123 <br />
          郵便番号: 12345 <br />
        </Caution>

        <MyStoreCheckout
          onCompletePayment={this.onCompletePayment.bind(this)}
          uid={this.props.uid}
          amount={this.amount}
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

const Caution = styled.div`
  margin-top: 40px;
  box-sizing: border-box;
  padding: 10px;
  width: 90%;
  color: #664D22;
  background-color: #FEFBE7;
  border: 1px solid #FEF5C7;
  border-radius: 4px;
`;
