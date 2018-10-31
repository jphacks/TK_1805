import React from 'react';
import { injectStripe, PaymentRequestButtonElement } from 'react-stripe-elements';
import { STORE_API_URL_BASE } from '../config/api';

class PaymentRequestForm extends React.Component {
  constructor(props) {
    super(props);

    // For full documentation of the available paymentRequest options, see:
    // https://stripe.com/docs/stripe.js#the-payment-request-object
    const paymentRequest = props.stripe.paymentRequest({
      country: 'JP',
      currency: 'jpy',
      total: {
        label: '[DEMO] OAISOでのお支払い',
        amount: props.amount,
      },
    });

    paymentRequest.on('token', ({complete, token, ...data}) => {
      console.log('Received Stripe token: ', token);
      console.log('Received customer information: ', data);

      fetch(`${STORE_API_URL_BASE}/payment`, {
        method: 'POST',
        body: JSON.stringify({
          amount: this.props.amount,
          userID: this.props.uid,
          token: token.id,
          groupId: this.props.groupId
        }),
        mode: 'cors',
      }).then(response => {
        return response.json();
      }).then(data => {
        if (data.error !== "") {
          console.error(data);
          complete('fail');
          alert('[DEMO] 有効なカード情報が入力されておらず、決済に失敗しました。');
        } else {
          complete('success');
          this.props.onCompletePayment();
        }
      }).catch(e => {
        complete('fail');
        alert('[DEMO] サーバーに問題が発生し決済に失敗しました。');
      });
    });

    paymentRequest.canMakePayment().then((result) => {
      this.setState({canMakePayment: !!result});
    });

    this.state = {
      canMakePayment: false,
      paymentRequest,
    };
  }

  componentWillReceiveProps(props) {
    this.state.paymentRequest.update({
      total: {
        label: '[DEMO] OAISOでのお支払い',
        amount: props.amount,
      }
    });
  }

  render() {
    return this.state.canMakePayment ? (
      <PaymentRequestButtonElement
        paymentRequest={this.state.paymentRequest}
        className="PaymentRequestButton"
        style={{
          // For more details on how to style the Payment Request Button, see:
          // https://stripe.com/docs/elements/payment-request-button#styling-the-element
          paymentRequestButton: {
            theme: 'light',
            height: '64px',
          },
        }}
      />
    ) : this.props.note;
  }
}
export default injectStripe(PaymentRequestForm);
