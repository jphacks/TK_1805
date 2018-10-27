import * as React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  title: string,
  history: any,
};

export default class Header extends React.Component<Props> {
  render() {
    return (
      <NavigationHeader>
        <BackButton onClick={ () => this.props.history.goBack() }>
          <FontAwesomeIcon icon="chevron-left" />
          <span style={{ marginLeft: 8 }}>
            戻る
          </span>
        </BackButton>
        <NavigationItem>
          { this.props.title }
        </NavigationItem>
        <BlankContainer></BlankContainer>
      </NavigationHeader>
    );
  }
}

const NavigationHeader = styled.header`
  padding: 26px 0;
  width: 100%;
  background-color: white;
  font-weight: bold;

  display:flex;
  align-items: center;

  & > * {
    width: 100%;
  }

  & > h1 {
    text-align: center;
  }
`;

const BackButton = styled.button`
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  color: #9B9B9B;
`;

const NavigationItem = styled.h1`
  font-size: 22px;
  flex: 3;
  text-align: center;
  margin: 0;
  font-weight: 900;
`;

const BlankContainer = styled.div`
  flex: 1;
`;
