import * as React from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

type Props = {
  isOpen: boolean,
  tableId: string,
  onRequestClose: () => void,
};

@inject(({ store }) => ({
  tableId: store.tableId,
}))
@observer
export default class PaymentMethodModal extends React.Component<Props> {
  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        style={styles.container}
        onRequestClose={ () => this.props.onRequestClose() }
      >
        <Link to={`/tableId/${this.props.tableId}/pay&paymentMethod=apple_pay`}>Apple Pay</Link>
        <Link to={`/tableId/${this.props.tableId}/pay&paymentMethod=credit_card`}>クレジットカード</Link>
        <Link to={`/tableId/${this.props.tableId}/pay&paymentMethod=line_pay`}>LINE Pay</Link>
        <Link to={`/tableId/${this.props.tableId}/pay&paymentMethod=cash`}>現金でお支払い</Link>

        <button onClick={ () => this.props.onRequestClose() }>✕</button>
      </Modal>
    );
  }
}

const styles = {
  container: {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
