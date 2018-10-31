import * as React from 'react';
import styled from 'styled-components';

export default ({ amount, style }) => {
  return (
    <Amount style={style}>
      <p>小計</p>
      <p>{ amount }円</p>
    </Amount>
  );
}

const Amount = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 90%;
  padding: 10px;
  border: 1px solid lightgrey;
  border-radius: 4px;
  color: grey;
  font-weight: bold;

  & > p {
    margin: 0;
  }
`;
