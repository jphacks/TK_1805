import * as React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Order } from '../types/order';
import Initializer from '../components/Initializer';
import Header from '../components/Header';
import PaymentRequestForm from '../components/PaymentRequestForm';
import { Elements } from 'react-stripe-elements';
import Amount from '../components/Amount';
import CreditCardCaution from '../components/CreditCardCaution';

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
export default class ApplePay extends React.Component<Props> {
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
    alert('[DEMO] お支払いが完了しました。');
    this.props.history.push('/thankyou');
  }

  render() {
    return (
      <Main>
        <Initializer match={this.props.match} />
        <Header title='Apple Pay or Google Pay' history={this.props.history} />

        <Amount amount={this.amount} style={{ margin: '0 auto 40px' }} />

        <CreditCardCaution style={{ margin: '0 auto 40px' }}/>

        <Elements>
          <PaymentRequestForm
            uid={this.props.uid}
            amount={this.amount}
            groupId={this.props.groupId}
            onCompletePayment={this.onCompletePayment.bind(this)}
            note={
              <Note>
                ご利用のブラウザはApple PayとGoogle Payのどちらにも対応しておりません。
              </Note>
            }
          />
        </Elements>
      </Main>
    );
  }
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Note = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;
