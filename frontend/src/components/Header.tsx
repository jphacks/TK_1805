import * as React from 'react';
import styled from 'styled-components';

type Props = {
  title: string,
  history: any,
};

export default class Header extends React.Component<Props> {
  render() {
    return (
      <NavigationHeader>
        <BackButton onClick={ () => this.props.history.goBack() }>
          戻る
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
  height: 32px;
  width: 100%;
  background-color: white;
  z-index: 999;

  display:flex;
  align-items: center;

  & > * {
    width: 100%;
  }

  & > h1 {
    text-align: center;
  }
`

const BackButton = styled.button`
  flex: 1;
  font-size: 16px;
`

const NavigationItem = styled.h1`
  font-size:20px
  flex: 3;
  text-align: center;
`

const BlankContainer = styled.div`
  flex: 1;
`
