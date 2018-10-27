import * as React from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import stores from './stores';
import IndexTest from './pages/IndexTest';
import Poyo from './pages/Poyo';
import Top from './pages/Top';

export default class App extends React.Component {
  render() {
    return (
      <Provider { ...stores }>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={IndexTest} />
            <Route path='/poyo' component={Poyo} />
            <Route path='/tables/:tableId' component={Top} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}
