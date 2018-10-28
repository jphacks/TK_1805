import * as React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Order } from '../types/order';
import Initializer from '../components/Initializer';
import Header from '../components/Header';
import stripe from '../config/stripe';

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
export default class ApplePay extends React.Component<Props> {
  state = {
    number: '',
    exp_month: 11,
    exp_year: 2018,
    cvc: '',
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
    // const data = await stripe.createToken({
    //   card: {
    //     "number": '4242424242424242',
    //     "exp_month": 12,
    //     "exp_year": 2018,
    //     "cvc": '123'
    //   }
    // });

    // try {
    //   const response = await stripe.createToken({ card: this.card });
    //   const data = await response.json();

    //   console.debug(`Create Token ${data.id}`);

    //   // const storeResp = await fetch('http://35.221.123.85:5000', {
    //   const storeResp = await fetch('http://localhost:8880', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       amount: 1,
    //       userID: this.props.uid,
    //       token: data.id,
    //     })
    //   });

    //   const storeData = await storeResp.json();

    //   if (storeResp.ok) {
    //     alert('[DEMO] 決済に成功しました。')
    //   } else {
    //     alert(`[DEMO] 決済に失敗しました。有効なカード情報が入力されていません。`);
    //   }
    // } catch (e) {
    //   // TODO: handle error
    //   alert(`[DEMO] 決済に失敗しました。有効なカード情報が入力されていません。`);
    // }
  }

  paymentRequest: any = null;

  componentDidMount() {
    const Stripe = (window as any).Stripe;
    const stripe = Stripe('pk_test_DdyKpX6fYBy1gMoJqeVYdFuj');

    this.paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount: 1000,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    const elements = stripe.elements();
    const prButton = elements.create('paymentRequestButton', {
      paymentRequest: this.paymentRequest,
    });

    (async () => {
      // Check the availability of the Payment Request API first.
      const result = await this.paymentRequest.canMakePayment();
      if (result) {
        prButton.mount('#payment-request-button');
      } else {
        (document as any).getElementById('payment-request-button').style.display = 'none';
      }
    })();

    this.paymentRequest.on('token', async (ev) => {
      // Send the token to your server to charge it!
      const response = await fetch('/charges', {
        method: 'POST',
        body: JSON.stringify({token: ev.token.id}),
        headers: {'content-type': 'application/json'},
      });
    
      if (response.ok) {
        // Report to the browser that the payment was successful, prompting
        // it to close the browser payment interface.
        ev.complete('success');
      } else {
        // Report to the browser that the payment failed, prompting it to
        // re-show the payment interface, or show an error message and close
        // the payment interface.
        ev.complete('fail');
      }
    });
  }

  render() {
    return (
      <main>
        <Initializer match={this.props.match} />
        <Header title='Apple Pay' history={this.props.history} />

        <div style={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Appleの審査待ち
        </div>

        <div id="payment-request-button">
        </div>
      </main>
    );
  }
}
