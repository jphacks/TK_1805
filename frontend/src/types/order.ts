import firebase from '../config/firebase';

export type Order = {
  itemId: string,
  count: number,
  uid?: string,
  createdAt?: firebase.firestore.Timestamp,
};
