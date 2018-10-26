import * as React from 'react';
import { observer, inject } from 'mobx-react';

@inject(({ order }) => ({
  inbox: order.orders,
  add: order.add,
}))
@observer
export default class Poyo extends React.Component {
  render() {
    const list = (this.props as any).inbox.map(item => (
      <div>item.hoge</div>
    ));

    return (
      <div>
        { list }
        <button onClick={() => (this.props as any).add({ hoge: 1 }) } />
      </div>
    )
  }
}
