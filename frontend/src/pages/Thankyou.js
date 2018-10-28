import React, { Component } from 'react';
import './IndexTest.css';

export default class Thankyou extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={require('./thankyou.png')} className="App-logo" alt="logo" />
          <p>
            ご来店ありがとうございました！
          <br />
            またのお越しをお待ちしております。
          </p>
          <a
            className="App-link"
            href="https://github.com/jphacks/TK_1805"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact us
          </a>
        </header>
      </div>
    );
  }
}
