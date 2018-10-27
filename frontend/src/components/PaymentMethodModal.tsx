import * as React from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

Modal.setAppElement('#root');

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
        style={styles.modal}
        onRequestClose={ () => this.props.onRequestClose() }
      >
        <StyledLink
          to={`/tableId/${this.props.tableId}/pay&paymentMethod=apple_pay`}
          color='#9B9B9B'
        >
          Apple Pay
        </StyledLink>
        <StyledLink
          to={`/tableId/${this.props.tableId}/pay&paymentMethod=credit_card`}
          color='#4A90E2'
        >
          クレジットカード
        </StyledLink>
        <StyledLink
          to={`/tableId/${this.props.tableId}/pay&paymentMethod=line_pay`}
          color='#7ED321'
        >
          LINE Pay
        </StyledLink>
        <StyledLink
          to={`/tableId/${this.props.tableId}/pay&paymentMethod=cash`}
          color='#FFFFFF'
          textcolor='#4A4A4A'
        >
          現金でお支払い
        </StyledLink>

        <button onClick={ () => this.props.onRequestClose() }>✕</button>
      </Modal>
    );
  }
}

const styles = {
  modal: {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      display: 'flex',
      flexDirection: 'column-reverse',
      alignItems: 'center',
    }
  },
  container: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'flex-end',
    backgroundColor: 'transparent',
    border: 'none',
  }
};

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${props => props.color};
  color: ${props => props.textcolor || 'white'};
  border-radius: 114px;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
`;
