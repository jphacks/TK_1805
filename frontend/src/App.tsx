import * as React from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import stores from './stores';
import IndexTest from './pages/IndexTest';
import Poyo from './pages/Poyo';
import Top from './pages/Top';
import Category from './pages/Category';

export default class App extends React.Component {
  render() {
    return (
      <Provider { ...stores }>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={IndexTest} />
            <Route path='/poyo' component={Poyo} />
            <Route exact path='/tables/:tableId' component={Top} />
            <Route path='/tables/:tableId/categories/:categoryId' component={Category} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}
