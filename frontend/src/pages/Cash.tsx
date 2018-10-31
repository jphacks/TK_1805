import * as React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Order } from '../types/order';
import Initializer from '../components/Initializer';
import Header from '../components/Header';

const QRCode = require('qrcode.react');

type Props = {
  itemMap: any,
  orders: Order[],
  groupId: string,
  uid: string,
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
export default class Cash extends React.Component<Props> {
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

  render() {
    return (
      <main>
        <Initializer match={this.props.match} />
        <Header title='現金でのお支払い' history={this.props.history} />

        <Body>
          こちらの画面をスタッフにお見せください。 <br /> <br />

          <QRCode value={this.props.groupId} size={192} />
        </Body>
      </main>
    );
  }
}

const Body = styled.section`
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
`;
