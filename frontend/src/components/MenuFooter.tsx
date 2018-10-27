import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Order } from '../types/order';
import styled from 'styled-components';

type Props = {
  tableId: string,
  inbox?: Order[],
};

@inject(({ order }) => ({
  inbox: order.inbox,
}))
@observer
export default class MenuFooter extends React.Component<Props> {
  get totalCount() {
    console.log(this.props.inbox);

    if (!this.props.inbox) {
      return 0;
    }

    return this.props.inbox.slice().reduce((sum: number, order: Order) => (
      sum + order.count
    ), 0);
  }

  render() {
    return (
      <Footer>
        <Link to={`/tables/${this.props.tableId}/orders`} style={styles.orderIndexLink}>
          注文一覧・お会計
        </Link>

        { this.totalCount > 0 &&
          <Link to={`/tables/${this.props.tableId}/order`} style={styles.orderConfirmLink}>
            注文する <Counter>{ this.totalCount }</Counter>
          </Link>
        }
      </Footer>
    );
  }
}

const Footer = styled.footer`
  position: fixed;
  display: flex;
  bottom: 0;
  width: calc(100% - 48px);
  display: flex;
  align-items: center;
  padding-left: 24px;
  padding-right: 24px;
  justify-content: space-between;
  height: 58px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
  background-color: white;
`;

const Counter = styled.div`
  width: 24px;
  height: 24px;
  color: #F5A623;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  border-radius: 50%;
  margin-left: 12px;
`;

const styles = {
  orderIndexLink: {
    fontSize: 18,
    color: '#F5A623',
    textDecoration: 'none',
  },
  orderConfirmLink: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 18,
    textDecoration: 'none',
    // whiteSpace: 'nowrap',
    color: 'white',
    padding: '9px 16px',
    borderRadius: 2,
    backgroundColor: '#FF8100',
  }
};
