import * as React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Order } from '../types/order';
import Initializer from '../components/Initializer';
import Header from '../components/Header';

const stripe = require('stripe-client')('pk_test_DdyKpX6fYBy1gMoJqeVYdFuj');

type Props = {
  itemMap: any,
  orders: Order[],
  match: any,
  history: any,
};

@inject(({ store, order }) => ({
  itemMap: store.itemMap,
  orders: order.orders
}))
@observer
export default class CreditCard extends React.Component<Props> {
  state = {
    number: '',
    exp_month: 1,
    exp_year: 2000,
    cvc: null,
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

  async onClickSendButton() {
    const data = await stripe.createToken({
      card: {
        "number": '4242424242424242',
        "exp_month": 12,
        "exp_year": 2018,
        "cvc": '123'
      }
    });

    const response = await fetch('http://localhost:8880', {
      method: 'POST',
      body: JSON.stringify({
        amount: 1000,
        userID: "123",
        token: data.id,
      })
    });

    console.log(response);

    const json = await response.json();

    console.log(json);
  }

  render() {
    return (
      <main>
        <Initializer match={this.props.match} />
        <Header title='クレジットカード' history={this.props.history} />

        <Form>
          <Label>カード番号</Label>

          <Input
            type='tel'
            required
            value={this.state.number}
            onChange={e => this.setState({ number: e.target.value })}
            placeholder="4321432143214321"
            autoComplete="cc-number"
          />

          <Label>有効期限</Label>

          <Input
            type='month'
            required
            autoComplete='cc-exp'
            value={`${this.state.exp_year}-${this.state.exp_month}`}
            onChange={e => {
              const values = e.target.value.split('-');
              this.setState({ exp_year: values[0], exp_month: values[1] });
            }}
          />

          <Label>CVC</Label>

          <Input
            type='tel'
            required
            autoComplete='cc-csc'
            value={this.state.cvc}
            onChange={e => this.setState({ cvc: Number(e.target.value)})}
            placeholder="123"
          />
        </Form>

        <SendButton onClick={this.onClickSendButton.bind(this)}>Send!</SendButton>
      </main>
    );
  }
}

const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.div`
  box-sizing: border-box;
  padding: 0 26px;

  display: grid;
  grid-template: 40px 40px 40px  / 1fr 2fr;
`;

const Label = styled.label`
  align-self: center;
`;

const Input = styled.input`
  border: 1px solid grey;
  border-radius: 8px;
  padding-left: 12px;
  height: 30px;
`;

const SendButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
  padding: 8px 0;
  font-size: 18px;
  color: white;
  font-weight: bold;
  border-radius: 80px;
  background-color: #F5A623;
`;
