import * as React from 'react';
import { Photo } from '../types/photo';
import { storage } from '../config/firebase';

type Props = {
  type: string,
  photo: Photo,
  style?: any,
};

type State = {
  url?: string,
};

const storageRef = storage.ref();

export default class FireStorageImage extends React.Component<Props, State> {
  static memo = { };

  state: State = { };

  get type() {
    switch (this.props.type) {
      case 'item': return 'items';
      case 'category': return 'categories';
      default: return '';
    }
  }

  componentWillMount() {
    const key = `${this.type}/${this.props.photo.filename}`;

    if (FireStorageImage.memo[key]) {
      this.setState({ url: FireStorageImage.memo[key] });
    }

    storageRef.child(key).getDownloadURL().then(url => {
      this.setState({ url });
      FireStorageImage.memo[key] = url;
    });
  }

  render() {
    if (!this.state.url) {
      return <div style={this.props.style} />;
    }

    return (
      <img src={this.state.url} style={this.props.style} />
    );
  }
}
