import * as React from 'react';

type Props = {
  title: string,
  history: any,
};

export default class Header extends React.Component<Props> {
  render() {
    return (
      <header>
        <button onClick={ () => this.props.history.goBack() }>
          戻る
        </button>
        <h1>
          { this.props.title }
        </h1>
      </header>
    );
  }
}
