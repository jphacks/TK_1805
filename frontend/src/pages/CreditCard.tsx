import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Order } from '../types/order';
import Initializer from '../components/Initializer';

const stripe = require('stripe-client')('pk_test_DdyKpX6fYBy1gMoJqeVYdFuj');

type Props = {
  itemMap: any,
  orders: Order[],
  match: any,
};

@inject(({ store, order }) => ({
  itemMap: store.itemMap,
  orders: order.orders
}))
@observer
export default class CreditCard extends React.Component<Props> {
  state = {
    number: '',
    exp_month: 0,
    exp_year: 0,
    cvc: 0,
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
      <div>
        <Initializer match={this.props.match} />

        <input value={this.state.number} onChange={e => this.setState({ number: e.target.value }) } />
        <input value={this.state.exp_month} onChange={e => this.setState({ exp_month: Number(e.target.value) }) } />
        <input value={this.state.exp_year} onChange={e => this.setState({ exp_year: Number(e.target.value) }) } />
        <input value={this.state.cvc} onChange={e => this.setState({ cvc: Number(e.target.value) }) } />

        <button onClick={this.onClickSendButton.bind(this)}>Send!</button>
      </div>
    );
  }
}
