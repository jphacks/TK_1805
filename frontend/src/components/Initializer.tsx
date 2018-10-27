import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Order } from '../types/order';

type Props = {
  storeId?: string,
  groupId?: string,
  itemMap?: any,
  initStore?: (tableId: string) => void,
  initOrder?: (storeId: string, groupId: string, notify: (ids: Order[]) => void) => void,
  match: any,
};

@inject(({ store, order }) => ({
  storeId: store.storeId,
  groupId: store.groupId,
  initStore: store.init,
  initOrder: order.init,
  itemMap: store.itemMap,
}))
@observer
export default class Initializer extends React.Component<Props> {
  constructor(props) {
    super(props);

    if (this.props.initStore) {
      this.props.initStore(this.props.match.params.tableId);
    }
  }

  componentWillMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.init(nextProps);
  }

  init(props: Props) {
    if (props.storeId && props.groupId && this.props.initOrder) {
      this.props.initOrder(props.storeId, props.groupId, this.notifyNewOrder.bind(this));
    }
  }

  // TODO: Test
  notifyNewOrder(orders: Order[]) {
    const items = orders.map(order => {
      const item = this.props.itemMap[order.itemId];
      if (!item) { return ''; }
      return `「${item.name}」x${order.count}`
    }).filter(name => name !== '').join('、');

    if (name !== '') {
      toast.info(`次の料理が注文されました。\n${items}`);
    }
  }

  render() {
    return <ToastContainer autoClose={5000} pauseOnHover={false} />;
  }
}
