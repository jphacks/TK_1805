import * as React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Order } from '../types/order';
import Initializer from '../components/Initializer';
import Header from '../components/Header';
import { STORE_API_URL_BASE } from '../config/api';
import Amount from '../components/Amount';

type Props = {
  itemMap: any,
  orders: Order[],
  groupId: string,
  storeName: string,
  uid: string,
  match: any,
  history: any,
};

@inject(({ store, order }) => ({
  itemMap: store.itemMap,
  orders: order.orders,
  uid: order.uid,
  groupId: store.groupId,
  storeName: store.name,
}))
@observer
export default class LinePay extends React.Component<Props> {
  state = {
    paymentURL: '',
    error: '',
    done: false,
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

  async componentDidUpdate() {
    await this.setupPaymentRequest();
  }

  async setupPaymentRequest() {
    if (this.props.groupId === '' || this.amount=== 0 || this.state.done) {
      return;
    } else {
      this.setState({ done: true });
    }

    try {
      const response = await fetch(`${STORE_API_URL_BASE}/linepay/reserve`, {
        method: 'POST',
        body: JSON.stringify({
          orderId: this.props.groupId + Math.random().toString(36).slice(-8),
          amount: this.amount,
          item: `[OAISO] ${this.props.storeName}でのお支払い`,
          redirectUrl: 'https://oaiso.tk/thankyou',
        })
      });

      const data = await response.json();

      console.log(data);

      if (data.error) {
        this.setState({ error: 'サーバーで問題が発生したため決済に進めません。他の決済方法をお試しください。' });
      } else {
        this.setState({ paymentURL: data.message.paymentURL });
      }
    } catch(e) {
      console.error(e);
      this.setState({ error: 'サーバーで問題が発生したため決済に進めません。他の決済方法をお試しください。' });
    }
  }

  render() {
    return (
      <Main>
        <Initializer match={this.props.match} />
        <Header title='LINE Pay' history={this.props.history} />

        <Amount amount={this.amount} style={{ marginBottom: 20 }} />

        { this.props.orders.length === 0
        ?
          <Description>
            まだ注文がありません。
          </Description>
        :
          this.state.error
        ?
          <Error>
            { this.state.error }
          </Error>
        :
          this.state.paymentURL === ''
        ?
          <Description>
            準備中
          </Description>
        :
          [
            <Description key={0}>
              準備が整いました。下のリンクからLINE Payのページに移動し決済を行ってください。
            </Description>,
            <PayButton key={1} href={this.state.paymentURL}>
              続ける
            </PayButton>
          ]
        }
      </Main>
    );
  }
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Description = styled.div`
  width: 80%;
  font-weight: bold;
`;

const Error = styled.div`
  width: 80%;
  color: red;
  font-weight: bold;
`;

const PayButton = styled.a`
  color: #00c300;
  background-color: white;
  border: 1px solid #00c300;
  border-radius: 4px;
  margin-top: 40px;
  padding: 10px 60px;
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`;
