import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyADON2Sh8SviGoldN9iP8EVMTZU5XQZBow",
  authDomain: "jphack2018-219415.firebaseapp.com",
  databaseURL: "https://jphack2018-219415.firebaseio.com",
  projectId: "jphack2018-219415",
  storageBucket: "jphack2018-219415.appspot.com",
  messagingSenderId: "1078175040609"
};


firebase.initializeApp(config);

export default firebase;

const firestore = firebase.firestore();

firestore.settings({ timestampsInSnapshots: true });

export const db = firestore;

export const storage = firebase.storage();

export const auth = firebase.auth();
