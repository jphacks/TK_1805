// FROM: https://github.com/stripe/react-stripe-elements#using-individual-element-components

// CardSection.js
import React from 'react';
import {CardElement} from 'react-stripe-elements';
import styled from 'styled-components';

class CardSection extends React.Component {
  render() {
    return (
      <label>
        <ElementWrapper>
          <CardElement
            onReady={(el) => el.focus()}
            style={styles.cardElement}
          />
        </ElementWrapper>
      </label>
    );
  }
}

const styles = {
  cardElement: {
    base: {
      fontSize: '18px',
    },
  }
};

export default CardSection;

const ElementWrapper = styled.div`
  box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
  border-radius: 4px;
  padding: 10px 14px;
`;
