const firebase = require('firebase');
require('firebase/firestore');

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyCd0_7gULMWdsrE2GG_UP2gwxSwpIQMzeg',
  authDomain: 'draw-something-e3f15.firebaseapp.com',
  databaseURL: 'https://draw-something-e3f15.firebaseio.com',
  projectId: 'draw-something-e3f15',
  storageBucket: 'draw-something-e3f15.appspot.com',
  messagingSenderId: '181673847548',
};

export default firebase.initializeApp(config);
