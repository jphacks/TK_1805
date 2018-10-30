// FROM: https://github.com/stripe/react-stripe-elements#setting-up-your-payment-form-injectstripe


// CheckoutForm.js
import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import styled from 'styled-components';

import CardSection from './CardSection';

const HOST_NAME = 'http://35.221.123.85:5000';

class CheckoutForm extends React.Component {
  async handleSubmit(ev) {
    ev.preventDefault();

    const { token } = this.props.stripe.createToken({name: 'Jenny Rosen'});

    console.debug('Received Stripe token:', token);

    const response = await fetch(`${HOST_NAME}/v1/payment/`, {
      method: 'POST',
      body: JSON.stringify({
        amount: 1,
        userID: this.props.uid,
        token: token,
      })
    });

    try {
      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert('[DEMO] 有効なカード情報が入力されておらず、決済に失敗しました。');
      } else {
        alert('[DEMO] 決済に成功しました。またのご来店をお待ちしております。');
        this.props.history.push('/thankyou');
      }
    } catch (e) {
      alert('[DEMO] サーバーに問題が発生し決済に失敗しました。')
    }
  };

  render() {
    return (
      <StyledForm onSubmit={this.handleSubmit.bind(this)}>
        <CardSection {...createOptions('18px')} />
        <PayButton>支払う</PayButton>
      </StyledForm>
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

const StyledForm = styled.form`
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 40px;
`;

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
