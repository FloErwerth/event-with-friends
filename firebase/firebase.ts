import db from '@react-native-firebase/database';

if (__DEV__) {
  db().useEmulator('http://127.0.0.1', 9000);
}

const firebaseDB = db;

export default firebaseDB;
