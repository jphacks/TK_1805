import * as React from 'react';
import styled from 'styled-components';

export default ({ style }) => (
  <Caution style={ style }>
    こちらはテスト環境の入力画面です。
    テスト環境では本物のクレジットカードの情報は利用できません。
    代わりに次の情報をご入力ください。

    <br />
    <br />

    カード番号: 4242 4242 4242 4242 <br />
    有効期限: 2038年12月 <br />
    CVC: 123 <br />
    郵便番号: 12345 <br />
  </Caution>
);

const Caution = styled.div`
  margin-top: 40px;
  box-sizing: border-box;
  padding: 10px;
  width: 90%;
  color: #664D22;
  background-color: #FEFBE7;
  border: 1px solid #FEF5C7;
  border-radius: 4px;
`;
