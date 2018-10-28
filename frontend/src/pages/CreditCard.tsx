import * as React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Order } from '../types/order';
import Initializer from '../components/Initializer';
import Header from '../components/Header';
import stripe from '../config/stripe';

const HOST_NAME = 'https://ee949b6c.ngrok.io';

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

  get card() {
    return {
      number: String(this.state.number),
      exp_month: Number(this.state.exp_month),
      exp_year: Number(this.state.exp_year),
      cvc: String(this.state.cvc).padStart(3, '0'),
    };
  }

  get host() {
    return 'http://35.221.123.85:5000';
  }

  async onClickSendButton() {
    // const response = await stripe.createToken({
    //   card: {
    //     "number": '4242424242424242',
    //     "exp_month": 12,
    //     "exp_year": 2018,
    //     "cvc": '123'
    //   }
    // });

    console.log(this.card);

    try {
      const response = await stripe.createToken({ card: this.card });
      const data = await response.json();

      if (data.error) {
        alert(data.error.message);
        this.setState({ error: data.error.message });
        return;
      }

      console.debug(data);
      console.debug(`Create Token ${data.id}`);

      const storeResp = await fetch(`${HOST_NAME}/v1/payment/`, {
        method: 'POST',
        body: JSON.stringify({
          amount: 1,
          userID: this.props.uid,
          token: data.id,
        }),
        mode: 'no-cors'
      });

      if (!storeResp.ok) {
        console.error('response: ', storeResp.body);
      }

      const storeData = await storeResp.json();

      console.log('data: ', storeData);

      if (storeResp.ok) {
        alert('[DEMO] 決済に成功しました。またのご来店をお待ちしております。');
        this.props.history.push('/thankyou');
      } else {
        alert(`[DEMO] 決済に失敗しました。有効なカード情報が入力されていません。`);
      }
    } catch (e) {
      // TODO: handle error
      alert(`[DEMO] 決済に失敗しました。有効なカード情報が入力されていません。`);
    }
  }

  render() {
    // TODO: validation

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
            onChange={e => this.setState({ cvc: e.target.value })}
            placeholder="123"
          />
        </Form>

        { this.state.error  &&
          <ErrorText style={{ color: 'red' }}>
            { this.state.error }
          </ErrorText>
        }

        <SendButton onClick={this.onClickSendButton.bind(this)}>
          クレジットカードで支払う
        </SendButton>
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

const ErrorText = styled.div`
  color: red;
  text-align: center;
  padding-top: 40px;
  padding-bottom: 40px;
  font-weight: bold;
`;
