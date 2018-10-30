// FROM: https://github.com/stripe/react-stripe-elements#setting-up-your-payment-form-injectstripe


// CheckoutForm.js
import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import styled from 'styled-components';

import CardSection from './CardSection';

const HOST_NAME = 'http://35.221.123.85:5000';

class CheckoutForm extends React.Component {
  async handleSubmit(ev) {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    const { token } = this.props.stripe.createToken({name: 'Jenny Rosen'});
    console.log('Received Stripe token:', token);

    const storeResp = await fetch(`${HOST_NAME}/v1/payment/`, {
      method: 'POST',
      body: JSON.stringify({
        amount: 1,
        userID: this.props.uid,
        token: token,
      })
    });

    // However, this line of code will do the same thing:
    //
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});

    // You can also use createSource to create Sources. See our Sources
    // documentation for more: https://stripe.com/docs/stripe-js/reference#stripe-create-source
    //
    // this.props.stripe.createSource({type: 'card', owner: {
    //   name: 'Jenny Rosen'
    // }});
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={styles.form}>
        <CardSection {...createOptions('18px')} />
        <PayButton>支払う</PayButton>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        ...(padding ? {padding} : {}),
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};

const styles = {
  form: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 40,
  },
};

const PayButton = styled.button`
  white-space: nowrap;
  border: 0;
  outline: 0;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0 14px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
  color: #fff;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  background-color: #6772e5;
  text-decoration: none;
  -webkit-transition: all 150ms ease;
  transition: all 150ms ease;
  margin-top: 40px;

  &:hover {
    color: #fff;
    cursor: pointer;
    background-color: #7795f8;
    transform: translateY(-1px);
    box-shadow: 0 7px 14px rgba(50, 50, 93, .10), 0 3px 6px rgba(0, 0, 0, .08);
  }
`;
