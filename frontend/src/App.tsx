import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import IndexTest from './pages/IndexTest';
import Poyo from './pages/Poyo';

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={IndexTest} />
          <Route path='/poyo' component={Poyo} />
        </Switch>
      </BrowserRouter>
    );
  }
}
