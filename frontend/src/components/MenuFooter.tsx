import * as React from 'react';
import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import { Order } from '../types/order';

type Props = {
  tableId: string,
  inbox?: Order[],
};

@inject(({ store }) => ({
  inbox: store.inbox,
}))
export default class MenuFooter extends React.Component<Props> {
  get totalCount() {
    if (!this.props.inbox) {
      return 0;
    }

    return this.props.inbox.reduce((sum: number, order: Order) => sum + order.count, 0);
  }

  render() {
    return (
      <footer>
        <Link to={`/tables/${this.props.tableId}`}>
          注文一覧・お会計
        </Link>

        <Link to={`/tables/${this.props.tableId}/order`}>
          注文する { this.totalCount }
        </Link>
      </footer>
    );
  }
}
