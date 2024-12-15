import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  // Bu bilgileri Firebase Console'dan alacaksınız
  apiKey: 'AIzaSyBMEKT8U61mteiQZRncRG9AEavZgJSLpfo',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'chatapp-2a676',
  databaseURL:
    'https://chatapp-2a676-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Firebase'i başlat
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export {firebase};
export default firebase;
