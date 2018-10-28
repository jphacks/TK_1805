import React, { Component } from 'react';
import './IndexTest.css';

class IndexTest extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={require('./smartphone_qr_code.png')} className="App-logo" alt="logo" />
          <p>
            店内のQRコードを読み取ってください。
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

export default IndexTest;
