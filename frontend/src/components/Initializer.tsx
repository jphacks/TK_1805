import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
  storeId?: string,
  groupId?: string,
  initStore?: (tableId: string) => void,
  initOrder?: (storeId: string, groupId: string) => void,
  match: any,
};

@inject(({ store, order }) => ({
  storeId: store.storeId,
  groupId: store.groupId,
  initStore: store.init,
  initOrder: order.init,
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
    console.log('componentWillMount')
    this.init(this.props);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.init(nextProps);
  }

  init(props: Props) {
    if (props.storeId && props.groupId && this.props.initOrder) {
      this.props.initOrder(props.storeId, props.groupId);
    }
  }

  render() {
    return <ToastContainer autoClose={5000} pauseOnHover={false} />;
  }
}
